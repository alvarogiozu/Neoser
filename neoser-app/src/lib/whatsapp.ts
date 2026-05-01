const DIALOG_API_URL = "https://waba.360dialog.io/v1/messages";

function getDialogApiKey() {
  return process.env.WHATSAPP_API_KEY;
}

function getWhatsappProvider() {
  return (process.env.WHATSAPP_PROVIDER || "360dialog").toLowerCase();
}

function getWhatoEndpoint() {
  return process.env.WHATSAPP_WHATO_ENDPOINT;
}

type TemplateParam = {
  type: "text";
  text: string;
};

/** Pre-built template names registered in 360dialog for NeoSer */
export const NEOSER_TEMPLATES = {
  bienvenida: "neoser_bienvenida",
  seguimiento: "neoser_seguimiento",
  recordatorio: "neoser_recordatorio",
  reactivacion: "neoser_reactivacion",
  confirmacion_pago: "neoser_confirmacion_pago",
} as const;

export async function sendWhatsappTemplate(
  to: string,
  template: string,
  params: TemplateParam[] = [],
) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: template,
      language: { code: "es" },
      components: params.length
        ? [{ type: "body", parameters: params }]
        : undefined,
    },
  };

  return sendProviderPayload(payload);
}

export async function sendWhatsappText(to: string, text: string) {
  return sendProviderPayload({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });
}

/**
 * Send welcome template after lead capture (called from contact-leads API).
 * Only sends if wa_consent is true. Non-blocking — errors are logged.
 */
export async function sendWelcomeIfConsented(
  phone: string,
  name: string,
  waConsent: boolean,
) {
  if (!waConsent) return;
  if (!getDialogApiKey() && getWhatsappProvider() === "360dialog") return;

  try {
    await sendWhatsappTemplate(phone, NEOSER_TEMPLATES.bienvenida, [
      { type: "text", text: name },
    ]);
  } catch (error) {
    console.error("Welcome WhatsApp failed:", error);
  }
}

async function sendProviderPayload(payload: Record<string, unknown>) {
  const provider = getWhatsappProvider();

  if (provider === "whato") {
    const endpoint = getWhatoEndpoint();
    const apiKey = getDialogApiKey();
    if (!endpoint || !apiKey) {
      throw new Error("Missing WHATSAPP_WHATO_ENDPOINT or WHATSAPP_API_KEY");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  }

  const apiKey = getDialogApiKey();
  if (!apiKey) throw new Error("WHATSAPP_API_KEY is missing");

  const response = await fetch(DIALOG_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "D360-API-KEY": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}
