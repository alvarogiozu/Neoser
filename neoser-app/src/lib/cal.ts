import crypto from "crypto";

function getCalSigningKey() {
  return process.env.CAL_WEBHOOK_SIGNING_KEY;
}

export function verifyCalWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const signingKey = getCalSigningKey();

  // If no signing key configured, allow webhook for staging setups.
  if (!signingKey) return true;
  if (!signatureHeader) return false;

  const digest = crypto.createHmac("sha256", signingKey).update(rawBody).digest("hex");
  const normalized = signatureHeader.replace(/^sha256=/, "").trim();

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(normalized));
  } catch {
    return false;
  }
}

