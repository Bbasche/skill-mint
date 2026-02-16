import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnectorClient } from "wagmi";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { createIDOSClient } from "@idos-network/client";

// ─── Config ──────────────────────────────────────────────────────────
const IDOS_NODE_URL = import.meta.env.VITE_IDOS_NODE_URL || "https://nodes.playground.idos.network";
const IDOS_ENCLAVE_URL = import.meta.env.VITE_IDOS_ENCLAVE_URL || "https://enclave.playground.idos.network";
const ISSUER_PUBLIC_KEY = import.meta.env.VITE_ISSUER_SIGNING_PUBLIC_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? "" : "http://localhost:3333");

// ─── wagmi → ethers signer adapter ──────────────────────────────────
function useEthersSigner({ chainId } = {}) {
  const { data: walletClient } = useConnectorClient({ chainId });
  return useMemo(() => {
    if (!walletClient?.transport?.request) return undefined;
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new BrowserProvider(transport, network);
    return new JsonRpcSigner(provider, account.address);
  }, [walletClient]);
}

// ─── Skill Badge Data ────────────────────────────────────────────────
const SKILL_BADGES = [
  {
    id: "solidity-dev",
    title: "Solidity Developer",
    icon: "⚙️",
    color: "#627EEA",
    description: "Smart contract development proficiency across EVM chains.",
    focusAreas: ["ERC-20/721/1155", "Gas optimization", "Upgradeable patterns"],
    level: "Advanced",
  },
  {
    id: "sc-auditor",
    title: "Smart Contract Auditor",
    icon: "🔍",
    color: "#E74C3C",
    description: "Security review and vulnerability assessment expertise.",
    focusAreas: ["Code review", "Threat modeling", "Vulnerability testing"],
    level: "Advanced",
  },
  {
    id: "dapp-dev",
    title: "dApp Developer",
    icon: "🚀",
    color: "#2ECC71",
    description: "Full-stack decentralized application development experience.",
    focusAreas: ["Frontend integration", "Blockchain APIs", "UX patterns"],
    level: "Intermediate",
  },
  {
    id: "crypto-expert",
    title: "Crypto Asset Expert",
    icon: "💎",
    color: "#F39C12",
    description: "Deep knowledge of digital assets, trading, and risk management.",
    focusAreas: ["DeFi protocols", "Risk analysis", "Portfolio management"],
    level: "Advanced",
  },
  {
    id: "web3-pm",
    title: "Web3 Product Manager",
    icon: "📊",
    color: "#9B59B6",
    description: "Experience shipping Web3 products and protocols.",
    focusAreas: ["Product strategy", "Tokenomics", "Community building"],
    level: "Intermediate",
  },
  {
    id: "bridge-expert",
    title: "Bridge Protocol Expert",
    icon: "🌉",
    color: "#1ABC9C",
    description: "Expertise in cross-chain communication and bridge protocols.",
    focusAreas: ["Atomic swaps", "State proofs", "Liquidity pools"],
    level: "Advanced",
  },
];

// ─── Main Component ──────────────────────────────────────────────────
export default function App() {
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();

  // idOS and wallet state
  const [idosClient, setIdosClient] = useState(null);
  const [idosReady, setIdosReady] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState(null);
  const [userEncryptionKey, setUserEncryptionKey] = useState(null);
  const iframeRef = useRef(null);

  // Minting state
  const [selectedBadges, setSelectedBadges] = useState(new Set());
  const [minting, setMinting] = useState(false);
  const [mintedBadges, setMintedBadges] = useState([]);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Initialize idOS Client ─────────────────────────────────────────
  useEffect(() => {
    if (!address || !signer) {
      setIdosClient(null);
      setIdosReady(false);
      return;
    }

    (async () => {
      try {
        setStatus("Initializing idOS client...");
        setErrorMessage("");

        // rc.1.0 API: createIDOSClient → createClient → withUserSigner → logIn
        // container must be a CSS selector string, not a DOM element
        const config = createIDOSClient({
          nodeUrl: IDOS_NODE_URL,
          enclaveOptions: {
            container: "#idOS-enclave",
            url: IDOS_ENCLAVE_URL,
          },
        });

        // createClient() internally loads the enclave iframe
        setStatus("Loading idOS enclave...");
        const idle = await config.createClient();

        // Attach the wallet signer
        setStatus("Connecting wallet signer...");
        const withSigner = await idle.withUserSigner(signer);

        // Log in to idOS
        setStatus("Logging in to idOS...");
        const loggedIn = await withSigner.logIn();

        setIdosClient(loggedIn);
        setIdosReady(true);
        setStatus("idOS client ready");
      } catch (err) {
        console.error("idOS init error:", err);
        setErrorMessage("Failed to initialize idOS: " + err.message);
        setIdosReady(false);
      }
    })();
  }, [address, signer]);

  // ─── Handle badge toggle ──────────────────────────────────────────
  const handleBadgeToggle = useCallback((badgeId) => {
    setSelectedBadges((prev) => {
      const next = new Set(prev);
      if (next.has(badgeId)) {
        next.delete(badgeId);
      } else {
        next.add(badgeId);
      }
      return next;
    });
    setErrorMessage("");
  }, []);

  // ─── Mint selected badges ────────────────────────────────────────
  const handleMint = useCallback(async () => {
    if (!address || !idosClient || selectedBadges.size === 0) {
      setErrorMessage("Connect wallet and select badges to mint");
      return;
    }

    setMinting(true);
    setStatus("Preparing minting...");
    setErrorMessage("");

    try {
      // Create credential object for backend
      const badgesToMint = SKILL_BADGES.filter((b) => selectedBadges.has(b.id));

      for (const badge of badgesToMint) {
        try {
          setStatus(`Minting ${badge.title}...`);

          // Request a Delegated Write Grant from idOS
          const dwgRequest = {
            writeableCredentialTypes: ["ProfessionalSkillCredential"],
            requesterPublicKey: Buffer.from(
              ISSUER_PUBLIC_KEY,
              "hex"
            ).toString("base64"),
          };

          const dwg = await idosClient.grantee.requestDelegatedWriteGrant(dwgRequest);

          // Send to backend for credential creation
          const response = await fetch(`${BACKEND_URL}/api/mint`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              badge,
              walletAddress: address,
              dwg,
              userEncryptionPublicKey: userEncryptionKey
                ? Buffer.from(userEncryptionKey).toString("base64")
                : null,
            }),
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || `HTTP ${response.status}`);
          }

          setMintedBadges((prev) => [...prev, badge.id]);
          setStatus(`Minted: ${badge.title}`);
        } catch (err) {
          console.error(`Error minting ${badge.title}:`, err);
          setErrorMessage(`Error minting ${badge.title}: ${err.message}`);
        }
      }

      // Clear selection after successful minting
      setSelectedBadges(new Set());
      setStatus("Minting complete!");
    } catch (err) {
      console.error("Mint error:", err);
      setErrorMessage("Minting failed: " + err.message);
    } finally {
      setMinting(false);
    }
  }, [address, idosClient, selectedBadges, userEncryptionKey]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0c29", color: "#e0e0e0", padding: "2rem" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            🎓 Skill Mint
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#888" }}>
            Self-attest your Web3 skills via idOS-backed credentials
          </p>
        </div>
        <ConnectButton />
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {!isConnected ? (
          <div style={{
            padding: "2rem",
            background: "#1a1a2e",
            borderRadius: "12px",
            border: "1px solid rgba(102, 126, 234, 0.2)",
            textAlign: "center",
          }}>
            <p>Connect your wallet to get started</p>
          </div>
        ) : (
          <>
            {/* Status Messages */}
            {status && (
              <div style={{
                padding: "1rem",
                background: "#1e4620",
                color: "#7cfc00",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #7cfc00",
              }}>
                {status}
              </div>
            )}

            {errorMessage && (
              <div style={{
                padding: "1rem",
                background: "#4a0e0e",
                color: "#ff6b6b",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #ff6b6b",
              }}>
                {errorMessage}
              </div>
            )}

            {!idosReady && (
              <div style={{
                padding: "1rem",
                background: "#3a3a1e",
                color: "#ffd700",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #ffd700",
              }}>
                Initializing idOS client...
              </div>
            )}

            {/* Badge Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}>
              {SKILL_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => handleBadgeToggle(badge.id)}
                  style={{
                    padding: "1.5rem",
                    background: selectedBadges.has(badge.id) ? `${badge.color}20` : "#1a1a2e",
                    border: selectedBadges.has(badge.id)
                      ? `2px solid ${badge.color}`
                      : "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    opacity: mintedBadges.includes(badge.id) ? 0.5 : 1,
                    transform: selectedBadges.has(badge.id) ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {/* Badge Icon */}
                  <div style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                  }}>
                    {badge.icon}
                  </div>

                  {/* Badge Title */}
                  <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: badge.color,
                  }}>
                    {badge.title}
                  </h3>

                  {/* Badge Level */}
                  <div style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.75rem",
                    background: badge.color + "30",
                    color: badge.color,
                    borderRadius: "12px",
                    marginBottom: "1rem",
                  }}>
                    {badge.level}
                  </div>

                  {/* Minted Badge */}
                  {mintedBadges.includes(badge.id) && (
                    <div style={{
                      display: "inline-block",
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.75rem",
                      background: "#2ECC71",
                      color: "#fff",
                      borderRadius: "12px",
                    }}>
                      ✓ MINTED
                    </div>
                  )}

                  {/* Description */}
                  <p style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    marginBottom: "1rem",
                    color: "#bbb",
                  }}>
                    {badge.description}
                  </p>

                  {/* Focus Areas */}
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}>
                    {badge.focusAreas.map((area) => (
                      <span
                        key={area}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                          background: "rgba(102, 126, 234, 0.2)",
                          borderRadius: "4px",
                          color: "#667eea",
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Selection Indicator */}
                  {selectedBadges.has(badge.id) && (
                    <div style={{
                      marginTop: "1rem",
                      textAlign: "center",
                      color: badge.color,
                      fontWeight: 600,
                    }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}>
              <button
                onClick={handleMint}
                disabled={minting || !idosReady || selectedBadges.size === 0}
                style={{
                  padding: "0.75rem 2rem",
                  background: selectedBadges.size > 0 ? "#667eea" : "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: selectedBadges.size > 0 && !minting ? "pointer" : "not-allowed",
                  opacity: minting ? 0.6 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                {minting
                  ? "Minting..."
                  : selectedBadges.size > 0
                    ? `Mint ${selectedBadges.size} Badge${selectedBadges.size !== 1 ? "s" : ""}`
                    : "Select badges to mint"}
              </button>

              {selectedBadges.size > 0 && (
                <button
                  onClick={() => setSelectedBadges(new Set())}
                  disabled={minting}
                  style={{
                    padding: "0.75rem 2rem",
                    background: "#444",
                    color: "#fff",
                    border: "1px solid #666",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Info Footer */}
            <div style={{
              padding: "1.5rem",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: "8px",
              borderLeft: "4px solid #667eea",
              fontSize: "0.9rem",
              color: "#bbb",
            }}>
              <strong style={{ color: "#667eea" }}>How it works:</strong> Select your skill badges, click mint, and grant idOS permission to create W3C verifiable credentials on your behalf. Your credentials are stored encrypted in the idOS network.
            </div>
          </>
        )}
      </div>

      {/* Hidden idOS enclave container */}
      <div ref={iframeRef} id="idOS-enclave" />
    </div>
  );
}
