type CreatePreferenceInput = {
  title: string;
  quantity: number;
  unitPrice: number;
  currencyId: string;
  payerEmail?: string;
  externalReference: string;
  notificationUrl: string;
  successUrl: string;
  pendingUrl: string;
  failureUrl: string;
};

export type MercadoPagoPreferenceResult = {
  id: string;
  initPoint: string | null;
  sandboxInitPoint: string | null;
};

export type MercadoPagoPaymentDetails = {
  id: number;
  status: string;
  status_detail?: string;
  external_reference?: string;
};

function getAccessToken() {
  return process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";
}

export function isMercadoPagoConfigured() {
  return Boolean(getAccessToken());
}

export async function createMercadoPagoPreference(
  input: CreatePreferenceInput,
): Promise<MercadoPagoPreferenceResult> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: input.title,
          quantity: input.quantity,
          unit_price: input.unitPrice,
          currency_id: input.currencyId,
        },
      ],
      payer: input.payerEmail ? { email: input.payerEmail } : undefined,
      external_reference: input.externalReference,
      notification_url: input.notificationUrl,
      back_urls: {
        success: input.successUrl,
        pending: input.pendingUrl,
        failure: input.failureUrl,
      },
      auto_return: "approved",
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Error Mercado Pago preferences: ${response.status} ${payload}`);
  }

  const data = await response.json();
  return {
    id: String(data.id),
    initPoint: data.init_point ?? null,
    sandboxInitPoint: data.sandbox_init_point ?? null,
  };
}

export async function getMercadoPagoPaymentById(
  paymentId: string,
): Promise<MercadoPagoPaymentDetails> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Error Mercado Pago payments: ${response.status} ${payload}`);
  }

  const data = await response.json();
  return {
    id: Number(data.id),
    status: String(data.status ?? ""),
    status_detail: data.status_detail ? String(data.status_detail) : undefined,
    external_reference: data.external_reference ? String(data.external_reference) : undefined,
  };
}
