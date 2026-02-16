// Vercel serverless function — POST /api/mint
import nacl from "tweetnacl";
import { idOSIssuer } from "@idos-network/issuer";

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

// Lazy-init issuer singleton
let issuer = null;
async function getIssuer() {
  if (!issuer) {
    issuer = await idOSIssuer.init({
      nodeUrl: NODE_URL,
      signingKeyPair,
      encryptionSecretKey,
    });
  }
  return issuer;
}

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

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const iss = await getIssuer();
    const { badge, walletAddress, dwg, userEncryptionPublicKey } = req.body;

    if (!badge || !walletAddress || !dwg) {
      return res.status(400).json({ error: "Missing required fields: badge, walletAddress, dwg" });
    }
    if (!dwg.signature) {
      return res.status(400).json({ error: "Missing DWG signature" });
    }

    // Build the VC JSON content
    const vcContent = buildVCContent(badge, walletAddress);
    const plaintextContent = new TextEncoder().encode(JSON.stringify(vcContent));

    // Build public notes
    const publicNotes = JSON.stringify({
      type: "ProfessionalSkillCredential",
      issuer: "Skill Mint",
      skill: badge.title,
      level: badge.level,
      issuedAt: new Date().toISOString(),
    });

    // Decode user encryption public key if provided
    let recipientEncPubKey;
    if (userEncryptionPublicKey) {
      try {
        recipientEncPubKey = Uint8Array.from(
          Buffer.from(userEncryptionPublicKey, "base64")
        );
      } catch {
        // fallback to issuer key
      }
    }

    // Create credential via DWG
    const result = await iss.createCredentialByDelegatedWriteGrant(
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
    });
  }
}
