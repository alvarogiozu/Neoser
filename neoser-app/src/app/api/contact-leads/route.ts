import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactLeadSchema } from "@/lib/schemas";
import { syncLeadToHubspot } from "@/lib/hubspot";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check: admin only
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const url = request.nextUrl;
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");

    let query = supabase
      .from("contact_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("lead_status", status);
    }
    if (source) {
      query = query.eq("source", source);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = contactLeadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: lead, error } = await supabase
      .from("contact_leads")
      .insert({
        full_name: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        message: parsed.data.message,
        source: parsed.data.source,
        wa_consent: parsed.data.waConsent,
        gestation_weeks: parsed.data.gestationWeeks ?? null,
        service_interest: parsed.data.serviceInterest ?? null,
        expected_due_date: parsed.data.expectedDueDate ?? null,
      })
      .select("id")
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 500 });
    }

    // Optional CRM sync: do not fail lead capture if HubSpot is unavailable.
    try {
      await syncLeadToHubspot({
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        message: parsed.data.message,
        source: parsed.data.source,
        waConsent: parsed.data.waConsent,
        gestationWeeks: parsed.data.gestationWeeks,
        serviceInterest: parsed.data.serviceInterest,
        expectedDueDate: parsed.data.expectedDueDate,
      });
    } catch (syncError) {
      console.error("HubSpot sync failed:", syncError);
    }

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
