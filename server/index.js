import "dotenv/config";
import express from "express";
import cors from "cors";
import nacl from "tweetnacl";
import { idOSIssuer } from "@idos-network/issuer";

// ─── Config ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3333;
const NODE_URL = process.env.VITE_IDOS_NODE_URL || "https://nodes.playground.idos.network";

// Decode keypairs from env
const signingSecretKey = Uint8Array.from(
  Buffer.from(process.env.ISSUER_SIGNING_SECRET_KEY, "base64")
);
const signingPublicKey = Uint8Array.from(
  Buffer.from(process.env.VITE_ISSUER_SIGNING_PUBLIC_KEY, "hex")
);
const encryptionSecretKey = Uint8Array.from(
  Buffer.from(process.env.ISSUER_ENCRYPTION_SECRET_KEY, "base64")
);

const signingKeyPair = {
  publicKey: signingPublicKey,
  secretKey: signingSecretKey,
};

// ─── Initialize idOS Issuer ─────────────────────────────────────────
let issuer;

async function initIssuer() {
  console.log("Initializing idOS Issuer...");
  console.log("  Node URL:", NODE_URL);
  console.log("  Signing public key:", Buffer.from(signingPublicKey).toString("hex").slice(0, 16) + "...");

  issuer = await idOSIssuer.init({
    nodeUrl: NODE_URL,
    signingKeyPair,
    encryptionSecretKey,
  });

  console.log("idOS Issuer initialized successfully!");
}

// ─── Build W3C VC content ───────────────────────────────────────────
function buildVCContent(badge, walletAddress) {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setFullYear(expiry.getFullYear() + 1);

  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1",
    ],
    type: ["VerifiableCredential", "ProfessionalSkillCredential"],
    issuer: `did:key:z${Buffer.from(signingPublicKey).toString("base64url")}`,
    id: `urn:uuid:${crypto.randomUUID()}`,
    issuanceDate: now.toISOString(),
    expirationDate: expiry.toISOString(),
    credentialSubject: {
      id: `did:ethr:${walletAddress}`,
      skillName: badge.title,
      skillCategory: "Web3 Development",
      proficiencyLevel: badge.level,
      focusAreas: badge.focusAreas,
      assessmentMethod: "Self-attestation via Skill Mint",
      issuedVia: "idOS Skill Mint",
    },
  };
}

// ─── Express App ────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    issuerReady: !!issuer,
    signingPublicKey: Buffer.from(signingPublicKey).toString("hex"),
  });
});

// Mint credential via DWG
app.post("/api/mint", async (req, res) => {
  try {
    if (!issuer) {
      return res.status(503).json({ error: "Issuer not initialized yet" });
    }

    const { badge, walletAddress, dwg, userEncryptionPublicKey } = req.body;

    if (!badge || !walletAddress || !dwg) {
      return res.status(400).json({ error: "Missing required fields: badge, walletAddress, dwg" });
    }

    if (!dwg.signature) {
      return res.status(400).json({ error: "Missing DWG signature" });
    }

    console.log(`\nMinting "${badge.title}" for ${walletAddress.slice(0, 10)}...`);

    // Build the VC JSON content
    const vcContent = buildVCContent(badge, walletAddress);
    const plaintextContent = new TextEncoder().encode(JSON.stringify(vcContent));

    // Build public notes (visible metadata on idOS, not encrypted)
    const publicNotes = JSON.stringify({
      type: "ProfessionalSkillCredential",
      issuer: "Skill Mint",
      skill: badge.title,
      level: badge.level,
      issuedAt: new Date().toISOString(),
    });

    // Decode the user's encryption public key if provided
    // If not, the issuer will create a copy encrypted to itself
    let recipientEncPubKey;
    if (userEncryptionPublicKey) {
      try {
        recipientEncPubKey = Uint8Array.from(
          Buffer.from(userEncryptionPublicKey, "base64")
        );
      } catch {
        console.warn("Could not decode user encryption public key, using issuer's key");
      }
    }

    // Create credential via Delegated Write Grant
    const result = await issuer.createCredentialByDelegatedWriteGrant(
      {
        publicNotes,
        plaintextContent,
        recipientEncryptionPublicKey:
          recipientEncPubKey ||
          nacl.box.keyPair.fromSecretKey(encryptionSecretKey).publicKey,
      },
      {
        id: dwg.id,
        ownerWalletIdentifier: dwg.owner_wallet_identifier,
        consumerWalletIdentifier: dwg.grantee_wallet_identifier,
        issuerPublicKey: dwg.issuer_public_key,
        accessGrantTimelock: dwg.access_grant_timelock,
        notUsableBefore: dwg.not_usable_before,
        notUsableAfter: dwg.not_usable_after,
        signature: dwg.signature,
      }
    );

    console.log("Credential created!", {
      originalId: result.originalCredential.id,
      copyId: result.copyCredential.id,
    });

    res.json({
      success: true,
      credentialId: result.originalCredential.id,
      copyCredentialId: result.copyCredential.id,
      publicNotes,
      vcPreview: vcContent,
    });
  } catch (err) {
    console.error("Mint error:", err);
    res.status(500).json({
      error: err.message || "Failed to create credential",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// ─── Start ──────────────────────────────────────────────────────────
initIssuer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\nSkill Mint backend running on http://localhost:${PORT}`);
      console.log(`  POST /api/mint  — Create credential via DWG`);
      console.log(`  GET  /api/health — Health check\n`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize issuer:", err);
    process.exit(1);
  });
