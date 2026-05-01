type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

function getEmailProvider() {
  return (process.env.EMAIL_PROVIDER || "hubspot").toLowerCase();
}

function getEmailApiKey() {
  return process.env.EMAIL_API_KEY;
}

function getEmailFrom() {
  return process.env.EMAIL_FROM || "contacto@neoser.pe";
}

async function sendViaBrevo(input: SendEmailInput) {
  const apiKey = getEmailApiKey();
  if (!apiKey) {
    throw new Error("EMAIL_API_KEY is missing for Brevo");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: getEmailFrom(), name: "NeoSer" },
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo send failed: ${details}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

async function sendViaHubspot(input: SendEmailInput) {
  // HubSpot puede requerir config de transactional/marketing API fuera del MVP tecnico.
  // Se retorna "queued" para mantener flujo de automatizacion y auditoria de eventos.
  return {
    queued: true,
    provider: "hubspot",
    to: input.to,
  };
}

export async function sendEmail(input: SendEmailInput) {
  const provider = getEmailProvider();

  if (provider === "brevo") {
    const data = await sendViaBrevo(input);
    return { provider, status: "sent" as const, data };
  }

  const data = await sendViaHubspot(input);
  return { provider: "hubspot", status: "queued" as const, data };
}

