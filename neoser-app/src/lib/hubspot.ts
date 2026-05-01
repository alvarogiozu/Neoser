type HubspotLeadInput = {
  fullName: string;
  email?: string | null;
  phone: string;
  message: string;
  source: string;
  waConsent: boolean;
  gestationWeeks?: number;
  serviceInterest?: string;
  expectedDueDate?: string;
};

type HubspotBookingInput = {
  bookingId: string;
  fullName: string;
  email?: string | null;
  phone: string;
  serviceInterest?: string;
  preferredDate?: string;
  preferredTime?: string;
};

const HUBSPOT_BASE_URL = "https://api.hubapi.com";

function getHubspotToken() {
  return process.env.HUBSPOT_ACCESS_TOKEN;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0], lastname: "NeoSer" };
  return {
    firstname: parts.slice(0, -1).join(" "),
    lastname: parts.at(-1) ?? "NeoSer",
  };
}

async function hubspotRequest(path: string, body: Record<string, unknown>, retries = 1) {
  const token = getHubspotToken();
  if (!token) return { skipped: true as const };

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`${HUBSPOT_BASE_URL}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok || response.status === 409) {
        const json = await response.json().catch(() => null);
        return { skipped: false as const, ok: true as const, data: json };
      }

      const details = await response.text();
      lastError = new Error(`HubSpot request failed: ${details}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("HubSpot request failed");
}

async function createOrUpsertContact(properties: Record<string, unknown>) {
  const result = await hubspotRequest("/crm/v3/objects/contacts", { properties }, 1);
  return result;
}

async function createDeal(properties: Record<string, unknown>) {
  const result = await hubspotRequest("/crm/v3/objects/deals", { properties }, 1);
  return result;
}

export async function syncLeadToHubspot(input: HubspotLeadInput) {
  const token = getHubspotToken();
  if (!token) return { skipped: true as const };

  const { firstname, lastname } = splitName(input.fullName);
  await createOrUpsertContact({
    firstname,
    lastname,
    email: input.email || undefined,
    phone: input.phone,
    fuente_origen: input.source,
    wa_consent: input.waConsent ? "true" : "false",
    semanas_gestacion: input.gestationWeeks?.toString(),
    neoser_servicio_interes: input.serviceInterest,
    fecha_parto: input.expectedDueDate,
    neoser_last_message: input.message,
  });

  await createDeal({
    dealname: `Lead Web - ${input.fullName}`,
    dealstage: "lead_nueva",
    pipeline: "default",
    amount: undefined,
    neoser_servicio_interes: input.serviceInterest,
    neoser_source: input.source,
    neoser_wa_consent: input.waConsent ? "true" : "false",
    neoser_contact_phone: input.phone,
  });

  return { skipped: false as const, ok: true as const };
}

export async function syncBookingToHubspot(input: HubspotBookingInput) {
  const token = getHubspotToken();
  if (!token) return { skipped: true as const };

  const { firstname, lastname } = splitName(input.fullName);
  await createOrUpsertContact({
    firstname,
    lastname,
    email: input.email || undefined,
    phone: input.phone,
    neoser_last_booking_id: input.bookingId,
    neoser_servicio_interes: input.serviceInterest,
  });

  await createDeal({
    dealname: `Reserva - ${input.fullName}`,
    dealstage: "appointmentscheduled",
    pipeline: "default",
    neoser_booking_id: input.bookingId,
    neoser_servicio_interes: input.serviceInterest,
    neoser_preferred_date: input.preferredDate,
    neoser_preferred_time: input.preferredTime,
    neoser_contact_phone: input.phone,
  });

  return { skipped: false as const, ok: true as const };
}
