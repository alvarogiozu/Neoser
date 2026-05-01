# Terminal A — CRM / Operación Comercial (RevOps)

> **Owner**: Claude A (Claude 1)
> **Scope**: Pipeline comercial, campos de lead, automatizaciones HubSpot, operación diaria de Diana
> **No toca**: código de la app, APIs, SQL, decisiones de arquitectura
> **Última actualización**: 2026-04-20 T-4

---

## Decisiones vigentes

1. **CRM**: HubSpot Free. Justificación: formularios nativos, email tracking, app móvil, 1M contactos gratis. Diana opera sola con nivel técnico bajo — simplicidad > features.
2. **Pipeline**: 6 etapas fijas. No se agregan etapas sin validar conversión real primero.
3. **Workflows**: 5/5 slots usados (3 operativos P0 + 2 lifecycle P1). Si se necesitan más, subir a Starter ($20/mes) o priorizar.
4. **Integración**: Terminal A no codea. Define contratos, Terminal C implementa. Sync a HubSpot es no-bloqueante (si falla, el lead se guarda en Supabase igual).

---

## Avances reales (archivos que EXISTEN)

### P0 — Operativo (done)
| Entregable | Archivo | Existe |
|-----------|---------|--------|
| Pipeline 6 etapas | Configuración HubSpot UI (no archivo) | pendiente de acceso |
| Campos obligatorios | Definidos en este doc, sección "Campos" | si |
| Contrato API HubSpot | Definido en este doc, sección "Contratos" | si |
| 3 Workflows operativos | Configuración HubSpot UI (no archivo) | pendiente de acceso |
| Guion diario Diana | Definido en este doc, sección "Guion" | si |

### P1 — Innovación (done - documentos creados)
| Documento | Archivo | Existe |
|-----------|---------|--------|
| Lifecycle Nurturing | `neoser-app/docs/revops/01-lifecycle-nurturing.md` | si |
| Speed-to-Lead SLA | `neoser-app/docs/revops/02-speed-to-lead-sla.md` | si |
| Reactivación Playbook | `neoser-app/docs/revops/03-reactivation-playbook.md` | si |
| Motor de Referidos | `neoser-app/docs/revops/04-referral-engine.md` | si |
| Dashboard Semanal Diana | `neoser-app/docs/revops/05-weekly-dashboard-diana.md` | si |
| Cross-sell Lifecycle | `neoser-app/docs/revops/06-cross-sell-lifecycle.md` | si |

---

## Pipeline HubSpot "Nuevas Mamás NeoSer"

| # | Etapa | Probabilidad | Tiempo máx |
|---|-------|-------------|-----------|
| 1 | Lead Nueva | 10% | 24h |
| 2 | Contactada | 25% | 48h |
| 3 | Interesada | 50% | 72h |
| 4 | Propuesta Enviada | 75% | 72h |
| 5 | Inscrita (Won) | 100% | — |
| 6 | Perdida (Lost) | 0% | — |

Regla: ningún deal >7 días en la misma etapa sin acción.

---

## Campos custom HubSpot

### Contact (P0)
| Campo | Interno | Tipo |
|-------|---------|------|
| WhatsApp | `whatsapp` | Phone |
| Semanas gestación | `semanas_gestacion` | Text |
| Fuente de origen | `fuente_origen` | Dropdown: meta_ads, google_ads, ig_organico, whatsapp_directo, referida, web_form, otro |
| Consentimiento WA | `wa_consent` | Checkbox |

### Contact (P1)
| Campo | Interno | Tipo |
|-------|---------|------|
| Referida por | `referida_por` | Text |
| No contactar | `do_not_contact` | Checkbox |
| Intentos reactivación | `reactivation_count` | Number (0-3) |

### Deal (P0)
| Campo | Interno | Tipo |
|-------|---------|------|
| Servicio interés | `servicio_interes` | Dropdown: curso_prenatal, curso_postnatal, acompanamiento_individual, seminario, otro |
| Fecha parto | `fecha_parto` | Date |

### Deal (P1)
| Campo | Interno | Tipo |
|-------|---------|------|
| Siguiente servicio | `siguiente_servicio` | Dropdown (=servicio_interes) |

---

## Contratos con otros terminales

### Terminal C (Backend) — Contrato API HubSpot

**Crear contacto:**
```
POST https://api.hubapi.com/crm/v3/objects/contacts
Authorization: Bearer {HUBSPOT_ACCESS_TOKEN}

{
  "properties": {
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "whatsapp": "string (+51...)",
    "fuente_origen": "web_form | meta_ads | google_ads | ig_organico | whatsapp_directo | referida | otro",
    "wa_consent": "true | false",
    "semanas_gestacion": "string (opcional)"
  }
}
```

**Crear deal:**
```
POST https://api.hubapi.com/crm/v3/objects/deals
Authorization: Bearer {HUBSPOT_ACCESS_TOKEN}

{
  "properties": {
    "dealname": "Lead Web - {firstname} {lastname}",
    "dealstage": "lead_nueva",
    "pipeline": "nuevas_mamas_neoser",
    "servicio_interes": "string del dropdown",
    "fecha_parto": "YYYY-MM-DD (opcional)"
  }
}
```

**Env var**: `HUBSPOT_ACCESS_TOKEN` en Vercel.
**Estado**: Terminal C implementó sync no-bloqueante. Contrato cumplido.

### Terminal B (WhatsApp) — Dependencias mutuas
- **B necesita de A**: etapas pipeline para mapear plantillas WA por etapa (entregado).
- **A necesita de B**: templates aprobados 360dialog para nurturing lifecycle (P1, pendiente de acceso Diana a FB Business Manager).

---

## Workflows HubSpot (5/5 slots Free)

| # | Nombre | Trigger | Acción | Prio |
|---|--------|---------|--------|------|
| 1 | Bienvenida Lead | Contacto creado | Email + tarea Diana <1h | P0 |
| 2 | Seguimiento 24h | Deal 24h en Lead Nueva/Contactada | Tarea Diana WA | P0 |
| 3 | Auto-Perdida | Deal 14d sin actividad | Mover a Perdida + email | P0 |
| 4 | Nurturing Embarazo | Basado en fecha_parto | Emails + tareas por trimestre | P1 |
| 5 | Nurturing Postparto | fecha_parto pasó | Email postnatal + cross-sell | P1 |

---

## Guion diario Diana — "Café con CRM" (10 min)

```
[] Abrir HubSpot (app móvil)                         — 1 min
[] Revisar tareas pendientes del día                  — 2 min
[] Responder leads nuevas (mover a Contactada)        — 4 min
[] Seguimiento a Interesadas sin respuesta            — 2 min
[] Actualizar etapas de deals que avanzaron           — 1 min

REGLA: Si tocaste WhatsApp por NeoSer -> actualiza HubSpot.
```

---

## Bloqueos actuales

| Bloqueo | Depende de | Impacto |
|---------|-----------|---------|
| No se puede configurar HubSpot | Diana no ha creado cuenta ni dado accesos | Todo P0 de config queda en papel |
| No se pueden conectar Ads | Diana no ha compartido accesos Meta/Google Ads | fuente_origen de leads pagados no se trackea auto |
| No se pueden crear emails | Diana no ha provisto contenido (PDF bienvenida, emails educativos) | Workflows 1,4,5 sin contenido |
| No se pueden registrar templates WA | Diana no ha dado acceso a FB Business Manager | Terminal B bloqueado en go-live |

---

## Siguiente paso

1. **Inmediato**: cuando Diana dé acceso a HubSpot, configurar pipeline + campos + 3 workflows P0.
2. **Semana**: con datos de ads (accesos), conectar Meta/Google Ads a HubSpot para tracking automático de fuente.
3. **P1**: implementar lead scoring (proximidad parto + fuente) + activar workflows 4-5 de lifecycle.

---

## Changelog

| Fecha | Iter | Qué cambió |
|-------|------|-----------|
| 2026-04-20 | T-1 | Pipeline, campos P0, 3 automatizaciones, contrato API, guion Diana |
| 2026-04-20 | T-2 | 6 docs innovación creados en docs/revops/ (raíz) |
| 2026-04-20 | T-3 | Prompts individuales por terminal (sección 9 SYNC). Doc vivo migrado a neoser-app/docs/revops/ |
| 2026-04-20 | T-4 | Auditoría completa. 6 archivos reales creados en neoser-app/docs/revops/. Rutas corregidas. Bloqueos explicitados. |
