# TERMINAL-C-BACKEND

> **Nota de reorganización (2026-05-01):** este archivo se movió a `docs/05-entrega-y-qa/TERMINAL-C-BACKEND.md` (antes vivía en `neoser-app/docs/backend/`). La referencia a `SYNC-CLAUDES-NEOSER.md` apunta hoy a `docs/06-coordinacion-equipo/sync-claudes-neoser.md`.

Documento vivo del Terminal C (backend tecnico).

## Rol y scope
- SQL schema + migraciones
- RLS policies
- Contratos API (rutas, validacion, responses)
- Validaciones Zod
- Auth tecnico y proteccion de rutas
- Integracion tecnica HubSpot/WhatsApp (codigo, no estrategia)

## Reglas de trabajo
- No tocar estrategia comercial/copy (Terminal A).
- No tocar estrategia WhatsApp/templates (Terminal B).
- No tocar QA/deploy operativo (Terminal D).
- Al cerrar cada iteracion: actualizar este archivo y luego `SYNC-CLAUDES-NEOSER.md`.

---

## Schema SQL actual (6 tablas)

### profiles
| Columna | Tipo | Constraint |
|---|---|---|
| id | uuid PK | FK auth.users(id) ON DELETE CASCADE |
| full_name | text | nullable |
| role | text NOT NULL | default 'student', CHECK (admin/instructor/student) |
| created_at | timestamptz | default now() |

### courses
| Columna | Tipo | Constraint |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| title | text NOT NULL | - |
| description | text | nullable |
| price | numeric(10,2) | default 0 |
| currency | text NOT NULL | default 'PEN' |
| mode | text NOT NULL | default 'Presencial' |
| is_published | boolean NOT NULL | default false |
| created_at | timestamptz | default now() |

### enrollments
| Columna | Tipo | Constraint |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid NOT NULL | FK auth.users(id) |
| course_id | uuid NOT NULL | FK courses(id) |
| notes | text | nullable |
| status | text NOT NULL | default 'pending', CHECK (pending/paid/cancelled) |
| created_at | timestamptz | default now() |
| - | - | UNIQUE(user_id, course_id) |

### contact_leads
| Columna | Tipo | Constraint |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| full_name | text NOT NULL | - |
| email | text | nullable |
| phone | text NOT NULL | - |
| message | text NOT NULL | - |
| source | text NOT NULL | default 'web' |
| wa_consent | boolean NOT NULL | default false |
| gestation_weeks | smallint | CHECK 0-45, nullable |
| service_interest | text | nullable |
| expected_due_date | date | nullable |
| lead_status | text NOT NULL | default 'nuevo', CHECK (nuevo/contactado/interesado/propuesta_enviada/inscrito/perdido) |
| next_followup_at | timestamptz | nullable |
| assigned_to | uuid | FK auth.users(id) ON DELETE SET NULL, nullable |
| utm_source | text | nullable |
| utm_medium | text | nullable |
| utm_campaign | text | nullable |
| gclid | text | nullable |
| created_at | timestamptz | default now() |

### lead_notes
| Columna | Tipo | Constraint |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| lead_id | uuid NOT NULL | FK contact_leads(id) ON DELETE CASCADE |
| author_id | uuid NOT NULL | FK auth.users(id) ON DELETE CASCADE |
| body | text NOT NULL | - |
| created_at | timestamptz | default now() |

### wa_opt_outs
| Columna | Tipo | Constraint |
|---|---|---|
| phone | text PK | - |
| opted_out_at | timestamptz NOT NULL | default now() |

---

## RLS policies

| Tabla | Politica | Quien | Operacion |
|---|---|---|---|
| profiles | Own read | auth.uid() = id | SELECT |
| profiles | Admin manage | role = admin | ALL |
| courses | Public read published | is_published = true | SELECT |
| courses | Admin manage | role = admin | ALL |
| enrollments | Own read | auth.uid() = user_id | SELECT |
| enrollments | Own create | auth.uid() = user_id | INSERT |
| enrollments | Admin read all | role = admin | SELECT |
| contact_leads | Public create | true (anonimo) | INSERT |
| contact_leads | Admin read | role = admin | SELECT |
| contact_leads | Admin update | role = admin | UPDATE |
| lead_notes | Admin manage | role = admin | ALL |
| wa_opt_outs | Admin read | role = admin | SELECT |
| wa_opt_outs | (server ops) | service_role key bypasses RLS | ALL |

**Nota seguridad:** wa_opt_outs NO tiene policy abierta. Solo service_role (bypass RLS) puede escribir. Webhook usa `createServiceClient()`.

---

## Trigger

**handle_new_user**: AFTER INSERT on auth.users -> crea fila en profiles con role='student'. Security definer, search_path=''.

---

## Contratos API

### POST /api/contact-leads (publico)
```
Request:
{
  "fullName": string (2-120),
  "email"?: string (email) | "",
  "phone": string (7-20),
  "message": string (5-2000),
  "source"?: "meta_ads"|"google_ads"|"instagram_organico"|"whatsapp_directo"|"referida"|"web"|"otro" (default "web"),
  "waConsent": boolean,
  "gestationWeeks"?: number (0-45),
  "serviceInterest"?: string (3-120),
  "expectedDueDate"?: string (YYYY-MM-DD)
}

201: { "ok": true }
400: { "error": "Datos invalidos", "details": { fieldErrors, formErrors } }
500: { "error": "No se pudo registrar el lead" }  (Supabase insert error)
500: { "error": "Error inesperado" }               (JSON parse u otro error no controlado)
```
Side effects: HubSpot sync (no-fail), WhatsApp welcome si waConsent=true (no-fail).

### GET /api/contact-leads (admin only)
```
Query params (opcionales):
  status: "nuevo"|"contactado"|"interesado"|"propuesta_enviada"|"inscrito"|"perdido"
  source: "meta_ads"|"google_ads"|"instagram_organico"|"whatsapp_directo"|"referida"|"web"|"otro"

200: [{ id, full_name, email, phone, message, source, wa_consent, gestation_weeks, service_interest, expected_due_date, lead_status, next_followup_at, assigned_to, utm_source, utm_medium, utm_campaign, gclid, created_at }]
401: { "error": "No autenticado" }
403: { "error": "Sin permisos" }
500: { "error": "Error al obtener leads" }
```

### GET /api/contact-leads/[id] (admin only)
```
200: { ...lead object }
403: { "error": "Sin permisos" }
404: { "error": "Lead no encontrado" }
```

### PATCH /api/contact-leads/[id] (admin only)
```
Request:
{
  "leadStatus"?: "nuevo"|"contactado"|"interesado"|"propuesta_enviada"|"inscrito"|"perdido",
  "nextFollowupAt"?: string (ISO datetime) | null,
  "assignedTo"?: string (uuid) | null
}

200: { ...updated lead object }
400: { "error": "Datos invalidos" | "Nada que actualizar" }
403: { "error": "Sin permisos" }
500: { "error": "No se pudo actualizar" }
```

### GET /api/lead-notes (admin only)
```
Query params:
  leadId: string (uuid, requerido)

200: [{ id, lead_id, author_id, body, created_at, profiles: { full_name } }]
400: { "error": "leadId requerido" }
403: { "error": "Sin permisos" }
500: { "error": "Error al obtener notas" }
```

### POST /api/lead-notes (admin only)
```
Request:
{
  "leadId": string (uuid),
  "body": string (1-2000)
}

201: { id, lead_id, author_id, body, created_at, profiles: { full_name } }
400: { "error": "Datos invalidos" }
403: { "error": "Sin permisos" }
500: { "error": "No se pudo guardar la nota" }
```

### GET /api/courses (publico)
```
200: { "items": [{ id, title, description, price, currency, mode, is_published }] }
500: { "error": "No se pudieron cargar los cursos" }
```

### POST /api/enrollments (auth requerida)
```
Request:
{
  "courseId": string (uuid),
  "notes"?: string (max 500)
}

201: { "ok": true }
400: { "error": "Datos invalidos" }
401: { "error": "No autenticado" }
500: { "error": "No se pudo registrar la matricula" }
```

### POST /api/whatsapp (admin only)
```
Request:
{
  "to": string (8-20),
  "template": string (3-100),
  "params"?: [{ "type": "text", "text": string }]
}

200: { "ok": true, "data": {...} }
400: { "error": "Datos invalidos" }
401: { "error": "No autenticado" }
403: { "error": "No autorizado" }
500: { "error": "No se pudo enviar mensaje", "details": "..." }
```

### GET /api/whatsapp/webhook (verificacion 360dialog)
```
Query: hub.mode=subscribe&hub.verify_token=SECRET&hub.challenge=CHALLENGE
200: CHALLENGE (text)
403: { "error": "Forbidden" }
```

### POST /api/whatsapp/webhook (recepcion mensajes)
```
Body: 360dialog webhook payload
200: { "ok": true }
```
Side effects: opt-out check/persist, auto-reply por intent.

### GET /api/auth/callback (code exchange)
```
Query: code=AUTH_CODE&next=/
302: redirect a origin+next o /login?error=...
```

---

## Auth flow
1. `/login` -> Server Actions (login/signup)
2. Signup -> trigger handle_new_user -> profile con role=student
3. Email confirm -> `/api/auth/callback` -> code exchange
4. `/admin` protegido por proxy.ts -> middleware chequea sesion + rol admin

---

## Supabase clients
| Client | Archivo | Uso |
|---|---|---|
| Browser | src/lib/supabase/client.ts | Componentes cliente |
| Server (anon) | src/lib/supabase/server.ts | API routes, Server Actions |
| Service role | src/lib/supabase/service.ts | Webhook, ops que bypasean RLS |

---

## Env vars backend
| Variable | Requerida | Descripcion |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | si | URL proyecto Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | si | Anon key |
| SUPABASE_SERVICE_ROLE_KEY | si | Service role key (webhook wa_opt_outs) |
| HUBSPOT_ACCESS_TOKEN | no | Sync CRM (falla silencioso si falta) |
| WHATSAPP_API_KEY | no | 360dialog API key (falla silencioso si falta) |
| WHATSAPP_WEBHOOK_SECRET | si* | Verificacion webhook (*solo si webhook activo) |

---

## Estado verificado contra codigo (2026-04-20 T-3)

Verificacion linea-por-linea entre este documento y el codigo fuente real.

### schema.sql match
- [x] profiles: 4 columnas, FK auth.users, CHECK role — coincide
- [x] courses: 8 columnas, gen_random_uuid(), defaults — coincide
- [x] enrollments: 7 columnas, UNIQUE(user_id, course_id) — coincide
- [x] contact_leads: 11 columnas, 9 datos + id + created_at — coincide
- [x] wa_opt_outs: 2 columnas, phone PK — coincide
- [x] trigger handle_new_user: security definer, search_path='' — coincide
- [x] 11 RLS policies: todas coinciden nombre, tabla, operacion y condicion

### Rutas API match
- [x] POST /api/contact-leads: public, Zod 9 campos, INSERT 9 campos, HubSpot sync, WA welcome — coincide
- [x] GET /api/courses: public, select published only, order desc — coincide
- [x] POST /api/enrollments: auth required, Zod 2 campos, INSERT con user_id — coincide
- [x] POST /api/whatsapp: admin-only (auth.getUser + profiles.role check) — coincide
- [x] GET /api/whatsapp/webhook: WHATSAPP_WEBHOOK_SECRET verify — coincide
- [x] POST /api/whatsapp/webhook: createServiceClient, opt-out keywords, intent routing — coincide
- [x] GET /api/auth/callback: exchangeCodeForSession, redirect — coincide

### Auth/admin guard match
- [x] proxy.ts: matcher ["/admin/:path*", "/login"] — coincide
- [x] middleware.ts: user check -> profile role query -> redirect /login o / — coincide
- [x] login/actions.ts: Server Actions login (signInWithPassword -> /admin) y signup (signUp -> /login?message) — coincide
- [x] login/page.tsx: form con 2 botones formAction — coincide

### Env vars backend
- [x] NEXT_PUBLIC_SUPABASE_URL: usado en client.ts, server.ts, service.ts — coincide
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY: usado en client.ts, server.ts — coincide
- [x] SUPABASE_SERVICE_ROLE_KEY: usado en service.ts — coincide
- [x] HUBSPOT_ACCESS_TOKEN: usado en hubspot.ts (opcional) — coincide
- [x] WHATSAPP_API_KEY: usado en whatsapp.ts (opcional) — coincide
- [x] WHATSAPP_WEBHOOK_SECRET: usado en webhook/route.ts — coincide

### Zod vs SQL vs INSERT alignment
- [x] contactLeadSchema (9 campos) -> INSERT (9 campos) -> contact_leads (9 datos + id + created_at) — 100% match
- [x] enrollmentSchema (2 campos) -> INSERT (3 campos: +user_id del auth) -> enrollments — 100% match
- [x] sendTemplateSchema en /api/whatsapp (3 campos) -> no persiste en DB, envia a 360dialog — correcto

### Discrepancias corregidas en esta iteracion
- Doc faltaba respuesta 500 "Error inesperado" (catch externo) en POST /api/contact-leads — CORREGIDO

---

## Pendientes P1 (no bloquean P0)
- Custom JWT claims para rol (elimina query extra en middleware)
- Campos P1 Terminal A: referida_por, do_not_contact, reactivation_count, siguiente_servicio
- Rate limiting en endpoints publicos
- Indices en contact_leads(source) y enrollments(user_id)

## Changelog

### [T-1] 2026-04-20
- Schema SQL 4 tablas + RLS 12 policies
- Trigger handle_new_user
- Middleware admin con chequeo de rol
- Auth flow: login page + actions + callback
- INSERT contact_leads alineado a 9 campos

### [T-2] 2026-04-20
- AUDIT: schema SQL vs Zod vs INSERT = 100% match (9/9 campos)
- FIX SEGURIDAD: wa_opt_outs RLS removida policy abierta `using(true)`. Solo service_role puede escribir.
- FIX SEGURIDAD: POST /api/whatsapp protegido con auth admin (antes publico).
- NUEVO: createServiceClient() para operaciones server que bypasean RLS.
- Webhook actualizado a service client para wa_opt_outs.
- Doc vivo completo con schema, RLS, contratos, env vars.

### [T-3] 2026-04-20
- VERIFICACION: lectura linea-por-linea de 12 archivos fuente contra este documento.
- Resultado: 100% match en schema (5 tablas), RLS (11 policies), rutas (7 endpoints), auth (proxy+middleware+actions), env vars (6), Zod vs SQL vs INSERT.
- FIX DOC: agregada respuesta 500 "Error inesperado" faltante en contrato POST /api/contact-leads.
- Seccion "Estado verificado contra codigo" agregada con checklist completo para referencia de Terminal D.
- P0 backend: CERRADO. No hay gaps entre documentacion y codigo.

### [T-4] 2026-04-20 — CRM MVP
- NUEVO: 6 columnas CRM en contact_leads: lead_status, next_followup_at, assigned_to, utm_source, utm_medium, utm_campaign, gclid
- NUEVO: tabla lead_notes (historial de notas por lead, admin only)
- NUEVO: RLS "Admin update contact leads" para operaciones CRM
- NUEVO: RLS "Admin manage lead notes" para notas
- NUEVO: migration incremental `supabase/migrations/001_crm_fields.sql`
- NUEVO: Zod schemas: leadStatusSchema, updateLeadSchema, createLeadNoteSchema
- NUEVO: GET /api/contact-leads (con filtros status/source, admin only)
- NUEVO: GET/PATCH /api/contact-leads/[id] (admin only)
- NUEVO: GET/POST /api/lead-notes (admin only)
- NUEVO: UI admin CRM en /admin (tabla leads, filtros, cambiar estado, followup, notas)
- Build: 15 rutas, 0 errores TS, lint limpio
