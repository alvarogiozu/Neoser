# TERMINAL-B-WHATSAPP

> **Nota de reorganización (2026-05-01):** este archivo se movió a `docs/04-playbooks-whatsapp/TERMINAL-B-WHATSAPP.md` (antes vivía en `neoser-app/docs/whatsapp/`). Las plantillas, política anti-baneo y checklist de go-live referenciados abajo viven hoy en `docs/04-playbooks-whatsapp/01-plantillas-360dialog.md`, `02-politica-anti-baneo.md`, `03-checklist-golive.md`, `04-provider-adapter.md`. La referencia a `SYNC-CLAUDES-NEOSER.md` apunta hoy a `docs/06-coordinacion-equipo/sync-claudes-neoser.md`.

Documento vivo del Terminal B (WhatsApp API oficial 360dialog).

## Rol y scope
- Estrategia anti-baneo (quality rating, warm-up, limites)
- Plantillas HSM para aprobacion de Meta
- Flujo webhook de recepcion y envio de mensajes
- Checklist go-live WhatsApp Business API

## Reglas de trabajo
- No tocar pipeline CRM (Terminal A).
- No tocar arquitectura backend general fuera de scope (Terminal C).
- No tocar QA/deploy (Terminal D).
- Al cerrar cada iteracion: actualizar este archivo y luego `SYNC-CLAUDES-NEOSER.md`.

---

## Estado actual (ultimo consolidado: 2026-04-20 T-3)

### BSP y config
- **BSP elegido**: 360dialog (oficial)
- **API base**: `https://waba.360dialog.io/v1/messages`
- **Auth 360dialog**: header `D360-API-KEY`
- **Env vars requeridas**:
  - `WHATSAPP_API_KEY` — API key de 360dialog
  - `WHATSAPP_WEBHOOK_SECRET` — token verificacion webhook
  - `SUPABASE_SERVICE_ROLE_KEY` — requerida por webhook para escribir opt-outs (bypasea RLS)
- **Endpoints en app**:
  - `POST /api/whatsapp` — envio de plantillas, **protegido con auth admin** (Terminal C T-2)
  - `GET /api/whatsapp/webhook` — verificacion suscripcion 360dialog (publico)
  - `POST /api/whatsapp/webhook` — recepcion de mensajes entrantes (publico, llamado por 360dialog)

### Archivos de codigo (scope B, verificados en codigo real)
| Archivo | Funcion | Estado |
|---|---|---|
| `src/lib/whatsapp.ts` | sendWhatsappTemplate(), sendWhatsappText(), sendWelcomeIfConsented(), NEOSER_TEMPLATES | OK - verificado |
| `src/app/api/whatsapp/route.ts` | Envio plantillas con auth admin + validacion Zod | OK - auth admin aplicada por Terminal C |
| `src/app/api/whatsapp/webhook/route.ts` | Webhook: opt-out, routing por intent, auto-reply. Usa `createServiceClient()` | OK - service client aplicado por Terminal C |
| `src/lib/supabase/service.ts` | createServiceClient() con service_role key | OK - creado por Terminal C |
| `supabase/schema.sql` (tabla wa_opt_outs) | phone PK, opted_out_at. RLS: solo admin read, service_role bypasea | OK - policy abierta removida por Terminal C |

### Documentacion operativa (scope B, todos verificados existentes)
| Archivo | Contenido | Estado |
|---|---|---|
| `docs/whatsapp/01-plantillas-360dialog.md` | 5 plantillas HSM con variables, categorias, notas registro | OK |
| `docs/whatsapp/02-politica-anti-baneo.md` | 10 reglas, protocolo emergencia, checklist Diana, metricas | OK |
| `docs/whatsapp/03-checklist-golive.md` | 7 bloques paso a paso, env vars, curls con auth admin, SQL corregido | ACTUALIZADO T-3 |

---

## Plantillas HSM definitivas

| Nombre | Categoria | Trigger | Variables | Mapeo pipeline HubSpot |
|---|---|---|---|---|
| `neoser_bienvenida` | MARKETING | Auto post-lead (wa_consent=true) via sendWelcomeIfConsented() | {{1}}=fullName | Lead Nueva |
| `neoser_seguimiento` | MARKETING | Diana manual o workflow HubSpot 24h | {{1}}=nombre, {{2}}=serviceInterest | Contactada |
| `neoser_recordatorio` | UTILITY | Diana manual o cron futuro | {{1}}=nombre, {{2}}=evento, {{3}}=fecha, {{4}}=hora | Propuesta Enviada |
| `neoser_reactivacion` | MARKETING | Workflow HubSpot 14d inactivo, max 1/30 dias | {{1}}=nombre, {{2}}=novedad | Perdida (reactivar) |
| `neoser_confirmacion_pago` | UTILITY | Post-pago validado (manual MVP) | {{1}}=nombre, {{2}}=curso, {{3}}=monto | Inscrita |

Body exacto de cada plantilla: ver `docs/whatsapp/01-plantillas-360dialog.md`

### Mapeo con Lifecycle Nurturing (Terminal A)
- **Embarazo temprano (sem 8-20)**: bienvenida (auto) + seguimiento (24h)
- **Embarazo medio (sem 20-32)**: seguimiento (curso prenatal)
- **Pre-parto (sem 32-40)**: recordatorio (cita/clase)
- **Post-parto**: reactivacion (servicios postnatales)
- **Conversion**: confirmacion_pago

P1: plantillas especificas por trimestre alineadas con matriz nurturing de Terminal A.

---

## Flujo webhook (verificado en codigo real)

```
360dialog envia POST a /api/whatsapp/webhook
  |
  +-- Es status update (delivery/read)? --> 200 ok silencioso
  |
  +-- Tiene messages[]?
       |
       +-- Para cada message: extraer from, text.body
       |
       +-- Keyword opt-out? (salir, parar, stop, no mas, no más, baja)
       |     SI: upsert wa_opt_outs via createServiceClient() + confirmar remocion por WA
       |     NO: continuar
       |
       +-- Telefono en wa_opt_outs? (query via createServiceClient())
       |     SI: skip silencioso
       |     NO: continuar
       |
       +-- routeReply(text):
             curso/clase/taller/capacitacion → info cursos
             precio/costo/inversion/cuanto → info precios
             pago/yape/plin/tarjeta → info pagos
             horario/fecha/cuando/calendario → info horarios
             default → menu general
             |
             TODAS incluyen: "Responde SALIR si no deseas recibir mas mensajes."
```

### Flujo bienvenida automatica (verificado en codigo real)

```
POST /api/contact-leads recibe lead
  → INSERT en Supabase
  → syncLeadToHubspot() (non-blocking)
  → sendWelcomeIfConsented(phone, name, waConsent) (non-blocking)
       → si waConsent=false: no hace nada
       → si WHATSAPP_API_KEY no existe: no hace nada
       → si waConsent=true: envia plantilla neoser_bienvenida con {{1}}=name
```

---

## Reglas anti-baneo (resumen ejecutivo)

1. **Solo opt-in explicito** — wa_consent=true en formulario web
2. **Cero listas compradas** — solo leads propios
3. **Ventana 24h** — fuera de ventana solo plantillas aprobadas
4. **Max 1 marketing/semana** por usuario, 1 reactivacion/30 dias
5. **Opt-out en cada marketing** — "Responde SALIR"
6. **Quality Rating diario** — verde=ok, amarillo=pausa marketing, rojo=pausa todo
7. **Escalar gradual** — sem1: 50/dia, sem2: 100, sem3: 250
8. **Responder siempre <24h** — webhook ya lo hace automatico
9. **Sin claims medicos** — NeoSer es salud, cuidado extra
10. **Lista exclusion activa** — tabla wa_opt_outs, nunca re-contactar

Detalle completo: `docs/whatsapp/02-politica-anti-baneo.md`

---

## Contratos con otros terminales

### Terminal A consume de B:
- Nombres exactos de plantillas (NEOSER_TEMPLATES) para workflows HubSpot
- Reglas de frecuencia para automatizaciones (no exceder limites anti-baneo)
- Opt-out keywords para que workflows no re-contacten a numeros en wa_opt_outs

### Terminal B consume de A:
- 6 etapas pipeline para mapear plantillas por etapa — CONSUMIDO
- Matriz de nurturing por semana gestacion para plantillas futuras — P1
- Campo wa_consent como prerequisito de envio — CONSUMIDO

### Terminal C consume/provee a B:
- Tabla wa_opt_outs en schema.sql — HECHO
- RLS corregida: policy abierta removida, service_role bypasea — RESUELTO por Terminal C T-2
- createServiceClient() en service.ts — PROVISTO por Terminal C T-2
- Auth admin en POST /api/whatsapp — APLICADO por Terminal C T-2

### Terminal D consume de B:
- Curls de testing actualizados (con auth admin) en docs/whatsapp/03-checklist-golive.md
- Tests de opt-out (enviar SALIR, verificar DB, verificar no-respuesta posterior)

---

## Dependencias y riesgos reales

### Blockers externos (no dependen de codigo)
- [ ] **Diana: acceso Facebook Business Manager** — sin esto no se puede hacer embedded signup en 360dialog ni registrar plantillas
- [ ] **Aprobacion Meta de plantillas** — 1-24h despues de registrar, no controlable

### Env vars requeridas en Vercel (blocker para funcionalidad)
- `WHATSAPP_API_KEY` — sin esto, envio de mensajes falla silenciosamente (sendWelcomeIfConsented retorna sin error)
- `WHATSAPP_WEBHOOK_SECRET` — sin esto, verificacion de webhook de 360dialog devuelve 403
- `SUPABASE_SERVICE_ROLE_KEY` — sin esto, opt-out no persiste en DB (webhook lanza error pero no crashea)

### Riesgos resueltos
- ~~RLS de wa_opt_outs exponia tabla a anon key~~ — RESUELTO por Terminal C T-2
- ~~POST /api/whatsapp sin auth~~ — RESUELTO por Terminal C T-2 (auth admin)
- ~~Webhook usaba createClient() (sesion usuario)~~ — RESUELTO por Terminal C T-2 (createServiceClient)

---

## Pendientes

### P0 completado (codigo)
Todo el codigo P0 de Terminal B esta entregado y verificado:
- whatsapp.ts con templates + welcome
- webhook con opt-out + routing
- schema con wa_opt_outs
- 3 docs operativos

### P0 pendiente (acciones externas)
- [ ] Diana: acceso Facebook Business Manager
- [ ] Registrar 5 plantillas en hub.360dialog.com
- [ ] Configurar webhook URL en 360dialog dashboard
- [ ] Configurar 3 env vars en Vercel

### P1 (siguiente semana)
- [ ] Plantillas por trimestre alineadas con lifecycle nurturing (Terminal A)
- [ ] Auto-crear lead en contact_leads cuando numero nuevo escribe por WhatsApp
- [ ] Tracking de delivery status (delivered/read) para metricas
- [ ] Rate limiting en webhook para proteger contra floods

---

## Innovaciones propuestas

### HOY (implementada)
Opt-out automatico en webhook con persistencia en DB via service_role. Cada respuesta incluye "Responde SALIR". Control anti-baneo mas critico ya funcional.

### SEMANA
Webhook enriquecido: al recibir mensaje de numero nuevo (no existente en contact_leads), auto-crear lead con source="whatsapp_directo" y wa_consent=true. Captura leads que llegan por WhatsApp sin pasar por formulario web.

---

## Changelog

### [2026-04-20 T-3] Iteracion 3 — Auditoria
- AUDITORIA: verificados los 5 archivos de codigo contra referencias en docs. Todos existen y matchean.
- FIX: `03-checklist-golive.md` Bloque 4 — SQL corregido (removida policy abierta "Service role manages opt-outs", alineado con fix de Terminal C T-2).
- FIX: `03-checklist-golive.md` Bloque 5 — curl actualizado con nota de auth admin (POST /api/whatsapp requiere sesion admin desde Terminal C T-2).
- FIX: `03-checklist-golive.md` Bloque 1 — agregada `SUPABASE_SERVICE_ROLE_KEY` a env vars requeridas.
- FIX: TERMINAL-B-WHATSAPP.md — corregida referencia "API publica" a "auth admin" para POST /api/whatsapp.
- Verificado: webhook usa createServiceClient() (no createClient). Correcto.
- Verificado: RLS wa_opt_outs solo tiene "Admin read opt-outs". Correcto.
- Riesgos anteriores marcados como RESUELTOS.

### [2026-04-20 T-2] Iteracion 2
- Documento vivo creado con formato completo.
- Consumido contexto de Terminal A: lifecycle nurturing mapeado a plantillas por etapa pipeline.

### [2026-04-20 T-1] Iteracion 1
- Codigo: webhook con opt-out, routing por intent, check DB.
- Codigo: sendWelcomeIfConsented() en whatsapp.ts, conectado a contact-leads API.
- Codigo: tabla wa_opt_outs en schema.sql con RLS.
- Docs: 01-plantillas, 02-anti-baneo, 03-checklist-golive creados.

### [INIT]
- Archivo creado para separar avances de Terminal B del documento maestro.
