"use client";

import { FormEvent, useState } from "react";

const sourceOptions = [
  { value: "web", label: "Sitio web" },
  { value: "meta_ads", label: "Meta Ads" },
  { value: "google_ads", label: "Google Ads" },
  { value: "instagram_organico", label: "Instagram organico" },
  { value: "whatsapp_directo", label: "WhatsApp directo" },
  { value: "referida", label: "Referida" },
  { value: "otro", label: "Otro" },
] as const;

export function ContactLeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      source: String(formData.get("source") || "web"),
      waConsent: formData.get("waConsent") === "on",
      serviceInterest: String(formData.get("serviceInterest") || ""),
      gestationWeeks: formData.get("gestationWeeks")
        ? Number(formData.get("gestationWeeks"))
        : undefined,
      expectedDueDate: String(formData.get("expectedDueDate") || ""),
    };

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo enviar");
      }

      event.currentTarget.reset();
      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Error inesperado");
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-4 p-6">
      <h3 className="text-xl font-bold text-[var(--navy)]">Solicita informacion</h3>

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
      <input
        name="serviceInterest"
        placeholder="Servicio de interes (ej. Curso Prenatal)"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          name="gestationWeeks"
          type="number"
          min={0}
          max={45}
          placeholder="Semanas de gestacion"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <input
          name="expectedDueDate"
          type="date"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
      </div>
      <select
        name="source"
        defaultValue="web"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      >
        {sourceOptions.map((source) => (
          <option key={source.value} value={source.value}>
            {source.label}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        required
        placeholder="Mensaje"
        className="min-h-28 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
      />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input name="waConsent" type="checkbox" required className="mt-0.5" />
        <span>Acepto recibir mensajes por WhatsApp relacionados a mi consulta.</span>
      </label>

      <button disabled={status === "loading"} className="btn-primary disabled:opacity-60">
        {status === "loading" ? "Enviando..." : "Enviar consulta"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">Gracias. Recibimos tu consulta correctamente.</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
