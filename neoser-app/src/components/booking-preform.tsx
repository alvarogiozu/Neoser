"use client";

import { FormEvent, useState } from "react";

export function BookingPreform() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      preferredDate: String(formData.get("preferredDate") || "") || undefined,
      preferredTime: String(formData.get("preferredTime") || "") || undefined,
      serviceInterest: String(formData.get("serviceInterest") || "") || undefined,
      notes: String(formData.get("notes") || "") || undefined,
      source: "web",
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo registrar");
      }

      event.currentTarget.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Error inesperado");
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-3 p-6">
      <h3 className="text-lg font-bold text-navy">Pre-registro de reserva</h3>
      <p className="text-xs text-gray-500">
        Completa este formulario para priorizar tu cita. Luego selecciona horario en el calendario.
      </p>

      <input
        name="fullName"
        required
        placeholder="Nombre completo"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <input
        name="phone"
        required
        placeholder="WhatsApp"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="Email (opcional)"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <input
          name="preferredDate"
          type="date"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <input
          name="preferredTime"
          placeholder="Hora referencial (ej. 10:30 AM)"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
      </div>
      <input
        name="serviceInterest"
        placeholder="Servicio de interes (ej. Control Prenatal)"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <textarea
        name="notes"
        placeholder="Observaciones (opcional)"
        className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />

      <button disabled={status === "loading"} className="btn-primary disabled:opacity-60">
        {status === "loading" ? "Guardando..." : "Guardar pre-reserva"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">Pre-reserva registrada. Ahora agenda tu horario en el calendario.</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

