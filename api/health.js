// Vercel serverless function — GET /api/health
const signingPublicKey = process.env.VITE_ISSUER_SIGNING_PUBLIC_KEY || "";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  res.json({
    ok: true,
    signingPublicKey,
  });
}
