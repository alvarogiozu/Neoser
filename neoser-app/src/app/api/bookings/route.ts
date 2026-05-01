import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBookingSchema } from "@/lib/schemas";
import { syncBookingToHubspot } from "@/lib/hubspot";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "No se pudieron cargar reservas" }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = createBookingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        full_name: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        preferred_date: parsed.data.preferredDate ?? null,
        preferred_time: parsed.data.preferredTime ?? null,
        service_interest: parsed.data.serviceInterest ?? null,
        source: parsed.data.source,
        notes: parsed.data.notes ?? null,
        booking_status: "pending",
      })
      .select("*")
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "No se pudo registrar la reserva" }, { status: 500 });
    }

    try {
      await syncBookingToHubspot({
        bookingId: booking.id,
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        serviceInterest: parsed.data.serviceInterest,
        preferredDate: parsed.data.preferredDate,
        preferredTime: parsed.data.preferredTime,
      });
    } catch (syncError) {
      console.error("HubSpot booking sync failed:", syncError);
    }

    return NextResponse.json({ ok: true, bookingId: booking.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

