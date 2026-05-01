"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  message: string;
  source: string;
  lead_status: string;
  next_followup_at: string | null;
  assigned_to: string | null;
  wa_consent: boolean;
  gestation_weeks: number | null;
  service_interest: string | null;
  expected_due_date: string | null;
  created_at: string;
}

interface LeadNote {
  id: string;
  lead_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

const STATUSES = [
  "nuevo",
  "contactado",
  "interesado",
  "propuesta_enviada",
  "inscrito",
  "perdido",
] as const;

const STATUS_COLORS: Record<string, string> = {
  nuevo: "bg-blue-100 text-blue-800",
  contactado: "bg-yellow-100 text-yellow-800",
  interesado: "bg-purple-100 text-purple-800",
  propuesta_enviada: "bg-orange-100 text-orange-800",
  inscrito: "bg-green-100 text-green-800",
  perdido: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  interesado: "Interesado",
  propuesta_enviada: "Propuesta enviada",
  inscrito: "Inscrito",
  perdido: "Perdido",
};


// ── Helpers ────────────────────────────────────────────────────────
function fmtDate(iso: string | null) {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(iso: string | null) {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Stats helpers ─────────────────────────────────────────────────
function computeStats(leads: Lead[]) {
  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let pendingFollowups = 0;
  const now = new Date();

  for (const s of STATUSES) byStatus[s] = 0;
  for (const lead of leads) {
    byStatus[lead.lead_status] = (byStatus[lead.lead_status] || 0) + 1;
    bySource[lead.source] = (bySource[lead.source] || 0) + 1;
    if (lead.next_followup_at && new Date(lead.next_followup_at) <= now) {
      pendingFollowups++;
    }
  }

  const total = leads.length;
  const inscritos = byStatus["inscrito"] || 0;
  const conversionRate = total > 0 ? ((inscritos / total) * 100).toFixed(1) : "0";

  return { byStatus, bySource, pendingFollowups, total, conversionRate };
}

function exportCSV(leads: Lead[]) {
  const headers = [
    "Nombre",
    "Email",
    "Telefono",
    "Mensaje",
    "Fuente",
    "Estado",
    "Seguimiento",
    "WA Consent",
    "Semanas gestacion",
    "Interes",
    "Fecha parto",
    "Creado",
  ];
  const rows = leads.map((l) => [
    l.full_name,
    l.email || "",
    l.phone,
    l.message.replace(/"/g, '""'),
    l.source,
    STATUS_LABELS[l.lead_status] || l.lead_status,
    l.next_followup_at || "",
    l.wa_consent ? "Si" : "No",
    l.gestation_weeks?.toString() || "",
    l.service_interest || "",
    l.expected_due_date || "",
    l.created_at,
  ]);

  const csv =
    [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-neoser-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Component ────────────────────────────────────────────────
export default function AdminCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch leads ────────────────────────────────────────────────
  async function fetchLeads() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact-leads");
      if (!res.ok) throw new Error();
      setLeads(await res.json());
    } catch {
      setError("No se pudieron cargar los leads");
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    void fetchLeads();
  }, []);

  // ── Client-side filtering ─────────────────────────────────────
  const filtered = leads.filter((lead) => {
    if (filterStatus && lead.lead_status !== filterStatus) return false;
    if (filterSource && lead.source !== filterSource) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        lead.full_name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const stats = computeStats(leads);

  // ── Fetch notes for selected lead ─────────────────────────────
  async function loadNotes(leadId: string) {
    try {
      const res = await fetch(`/api/lead-notes?leadId=${leadId}`);
      if (res.ok) setNotes(await res.json());
    } catch {
      /* silent */
    }
  }

  function selectLead(lead: Lead | null) {
    setSelectedLead(lead);
    if (lead) {
      loadNotes(lead.id);
    } else {
      setNotes([]);
    }
  }

  // ── Update lead field ─────────────────────────────────────────
  async function updateLead(id: string, payload: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/contact-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      if (selectedLead?.id === id) setSelectedLead(updated);
    } catch {
      setError("Error al actualizar lead");
    } finally {
      setSaving(false);
    }
  }

  // ── Add note ──────────────────────────────────────────────────
  async function addNote() {
    if (!selectedLead || !newNote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/lead-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selectedLead.id, body: newNote.trim() }),
      });
      if (!res.ok) throw new Error();
      const note = await res.json();
      setNotes((prev) => [note, ...prev]);
      setNewNote("");
    } catch {
      setError("Error al guardar nota");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--navy)]">CRM NeoSer</h1>
        <button
          onClick={() => exportCSV(filtered)}
          disabled={filtered.length === 0}
          className="rounded-lg border border-[var(--navy)] text-[var(--navy)] px-4 py-2 text-sm font-medium hover:bg-[var(--navy)] hover:text-white transition-colors disabled:opacity-40"
        >
          Exportar CSV
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
          {error}
          <button className="ml-2 underline" onClick={() => setError("")}>
            cerrar
          </button>
        </div>
      )}

      {/* ── Dashboard Metrics ──────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() =>
                setFilterStatus(filterStatus === s ? "" : s)
              }
              className={`surface-card p-3 text-center transition-all ${
                filterStatus === s
                  ? "ring-2 ring-[var(--pink)] scale-[1.02]"
                  : ""
              }`}
            >
              <div className="text-2xl font-bold text-[var(--navy)]">
                {stats.byStatus[s] || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {STATUS_LABELS[s]}
              </div>
            </button>
          ))}
          <div className="surface-card p-3 text-center">
            <div className="text-2xl font-bold text-[var(--pink)]">
              {stats.conversionRate}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Conversion</div>
          </div>
        </div>
      )}

      {/* ── Followup alert ─────────────────────────────────────── */}
      {stats.pendingFollowups > 0 && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-800 text-sm font-medium">
          {stats.pendingFollowups} seguimiento{stats.pendingFollowups > 1 ? "s" : ""} vencido{stats.pendingFollowups > 1 ? "s" : ""}
        </div>
      )}

      {/* ── Source breakdown (mini) ────────────────────────────── */}
      {!loading && leads.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(stats.bySource)
            .sort((a, b) => b[1] - a[1])
            .map(([src, count]) => (
              <button
                key={src}
                onClick={() =>
                  setFilterSource(filterSource === src ? "" : src)
                }
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  filterSource === src
                    ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {src} ({count})
              </button>
            ))}
        </div>
      )}

      {/* ── Search + Refresh ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar nombre, telefono o email..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white flex-1 min-w-[200px]"
        />

        <button
          onClick={fetchLeads}
          className="rounded-lg bg-[var(--navy)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--navy-dark)] transition-colors"
        >
          Actualizar
        </button>

        <span className="self-center text-sm text-gray-500">
          {filtered.length}
          {filtered.length !== leads.length && ` / ${leads.length}`} lead
          {filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* ── Lead Table ───────────────────────────────────────── */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <p className="text-gray-500 py-8 text-center">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">
              {leads.length === 0 ? "Sin leads" : "Sin resultados para el filtro"}
            </p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--navy)] text-white text-left">
                  <th className="px-3 py-2 rounded-tl-lg">Nombre</th>
                  <th className="px-3 py-2">Telefono</th>
                  <th className="px-3 py-2">Fuente</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Seguimiento</th>
                  <th className="px-3 py-2 rounded-tr-lg">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const overdue =
                    lead.next_followup_at &&
                    new Date(lead.next_followup_at) <= new Date();
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => selectLead(lead)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id
                          ? "bg-[var(--blue-light)]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-3 py-2.5 font-medium">
                        {lead.full_name}
                        {lead.email && (
                          <span className="block text-xs text-gray-400">
                            {lead.email}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">{lead.phone}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.lead_status] || ""}`}
                        >
                          {STATUS_LABELS[lead.lead_status] || lead.lead_status}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-2.5 text-xs ${overdue ? "text-red-600 font-semibold" : ""}`}
                      >
                        {fmtDateTime(lead.next_followup_at)}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">
                        {fmtDate(lead.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Lead Detail Panel ────────────────────────────────── */}
        {selectedLead && (
          <div className="w-full lg:w-96 surface-card p-5 flex flex-col gap-4 self-start">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-[var(--navy)]">
                {selectedLead.full_name}
              </h2>
              <button
                onClick={() => selectLead(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="text-sm space-y-1 text-gray-600">
              <p>
                <strong>Tel:</strong> {selectedLead.phone}
              </p>
              {selectedLead.email && (
                <p>
                  <strong>Email:</strong> {selectedLead.email}
                </p>
              )}
              <p>
                <strong>Mensaje:</strong> {selectedLead.message}
              </p>
              {selectedLead.service_interest && (
                <p>
                  <strong>Interes:</strong> {selectedLead.service_interest}
                </p>
              )}
              {selectedLead.gestation_weeks != null && (
                <p>
                  <strong>Semanas:</strong> {selectedLead.gestation_weeks}
                </p>
              )}
              {selectedLead.expected_due_date && (
                <p>
                  <strong>FPP:</strong> {fmtDate(selectedLead.expected_due_date)}
                </p>
              )}
              <p>
                <strong>WA Consent:</strong>{" "}
                {selectedLead.wa_consent ? "Si" : "No"}
              </p>
              <p>
                <strong>Fuente:</strong> {selectedLead.source}
              </p>
              <p>
                <strong>Creado:</strong> {fmtDateTime(selectedLead.created_at)}
              </p>
            </div>

            {/* Status change */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Estado
              </label>
              <select
                value={selectedLead.lead_status}
                onChange={(e) =>
                  updateLead(selectedLead.id, { leadStatus: e.target.value })
                }
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* Next followup */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Proximo seguimiento
              </label>
              <input
                type="datetime-local"
                value={
                  selectedLead.next_followup_at
                    ? selectedLead.next_followup_at.slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  updateLead(selectedLead.id, {
                    nextFollowupAt: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Notas ({notes.length})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addNote();
                  }}
                  placeholder="Agregar nota..."
                  disabled={saving}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={addNote}
                  disabled={saving || !newNote.trim()}
                  className="btn-primary !py-2 !px-3 text-sm disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {notes.length > 0 && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-gray-50 rounded-lg p-2 text-sm"
                    >
                      <p>{note.body}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {note.profiles?.full_name || "Admin"} &middot;{" "}
                        {fmtDateTime(note.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
