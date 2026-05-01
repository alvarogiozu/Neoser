# SYNC-CLAUDES-NEOSER

> **Nota de reorganización (2026-05-01):** este archivo se movió de la raíz a `docs/06-coordinacion-equipo/sync-claudes-neoser.md`. Las rutas de "documentos vivos por terminal" y los logs históricos abajo siguen mencionando paths antiguos como `neoser-app/docs/revops/`, `docs/whatsapp/`, etc. **Las rutas actuales están en la sección "2) Asignación por terminal" actualizada.** Los logs históricos se preservan tal cual por trazabilidad.

Documento maestro de coordinación viva para trabajo paralelo (Cursor + múltiples Claudes).

## Objetivo

Evitar cruces, duplicaciones y bloqueos; maximizar complementariedad e innovación entre terminales.

## Regla principal

Antes de empezar cualquier tarea, **cada Claude debe leer este archivo completo**.  
Antes de terminar su bloque, **debe actualizar este archivo** con sus cambios reales.

---

## 1) Estado global del proyecto (single source of truth)

- **Proyecto**: NeoSer
- **Stack fijo**: Next.js + Supabase + Vercel
- **CRM elegido**: CRM interno (Supabase + Next.js). HubSpot como sync opcional.
- **WhatsApp API elegida**: 360dialog (oficial)
- **Enfoque**: MVP hoy (P0), sin re-arquitectura

### P0 de hoy (obligatorio)
- Auth básico usable
- APIs mínimas: `contact-leads`, `courses`, `enrollments`
- RLS mínima segura
- Ruta admin protegida
- Google Maps con fallback
- Checklist staging/deploy/rollback

### P1 (siguiente bloque)
- Paridad visual 1:1 completa (animaciones y timing exacto)
- Integración CRM + Web + WhatsApp completa
- Dashboard operativo para Diana

---

## 2) Asignación por terminal (no cruzar scopes)

## Documentos vivos por terminal (obligatorio)
- General (coordinación): `docs/06-coordinacion-equipo/sync-claudes-neoser.md` *(este archivo)*
- Terminal A (RevOps/CRM): `docs/03-playbooks-revops/TERMINAL-A-REVOPS.md`
- Terminal B (WhatsApp): `docs/04-playbooks-whatsapp/TERMINAL-B-WHATSAPP.md`
- Terminal C (Backend): `docs/05-entrega-y-qa/TERMINAL-C-BACKEND.md`
- Terminal D (Delivery/QA): `docs/05-entrega-y-qa/TERMINAL-D-DELIVERY.md`

Regla:
- Cada terminal actualiza su documento propio en cada iteración.
- En el archivo general solo se registra resumen de decisión, bloqueos y dependencias.
- Si hay diferencia entre docs, prevalece:
  1) Documento del terminal dueño del scope.
  2) Decisión de arbitraje en sección de conflictos.

## Terminal A - CRM/Operación (HubSpot)
- **Owner**: Claude A
- **Scope**:
  - Pipeline comercial
  - Campos obligatorios de lead/deal
  - Automatizaciones operativas
  - Guion diario de Diana
- **No tocar**: código app/API

## Terminal B - WhatsApp API (360dialog)
- **Owner**: Claude B
- **Scope**:
  - Estrategia oficial anti-baneo
  - Plantillas
  - Flujo webhook/envío
  - Checklist go-live WhatsApp
- **No tocar**: decisiones de CRM pipeline

## Terminal C - Backend técnico
- **Owner**: Claude C
- **Scope**:
  - SQL + RLS + contratos API + validaciones + pruebas backend
- **No tocar**: estrategia comercial o copy de cliente

## Terminal D - Delivery/QA/Go-live
- **Owner**: Claude D
- **Scope**:
  - Checklist staging
  - QA mínimo
  - Rollback
  - Mensaje de entrega cliente
- **No tocar**: schema SQL y decisiones de arquitectura

## Cursor principal (Integrador)
- **Owner**: Cursor principal
- **Scope**:
  - Integrar output de A/B/C/D
  - Resolver conflictos
  - Ejecutar código/documentación final

---

## 3) Protocolo obligatorio de actualización (cada ciclo)

Cada Claude, al cerrar una iteración, debe añadir un bloque en:
- `## 7) Log incremental por terminal`

Formato obligatorio:

```txt
### [TIMESTAMP] [TERMINAL-X]
DECISION:
CAMBIOS/PROPUESTAS:
DEPENDENCIAS DE OTROS:
RIESGOS:
SIGUIENTE PASO:
ESTADO: done | in_progress | blocked
```

Reglas:
- No borrar entradas anteriores.
- No reescribir trabajo ya aceptado de otro terminal.
- Si detecta conflicto, no pisa: lo reporta en `## 6) Conflictos`.

---

## 4) Modo “Innovar y dar todo”

Cada Claude debe proponer:
- 1 mejora de alto impacto para hoy (rápida de implementar)
- 1 mejora de alto impacto para la siguiente semana

Pero con condiciones:
- Debe ser compatible con stack actual.
- Debe complementar scopes existentes.
- No debe duplicar ni interrumpir a otro terminal.

Formato:

```txt
INNOVACION_HOY:
INNOVACION_SEMANA:
```

---

## 5) Matriz de complementariedad (obligatoria)

- Terminal A debe consumir de B:
  - reglas anti-baneo para automatizaciones CRM.
- Terminal B debe consumir de A:
  - etapas pipeline para plantillas por etapa.
- Terminal C debe consumir de A y B:
  - campos mínimos en schema (`source`, trazabilidad, consentimiento).
- Terminal D debe consumir de C:
  - pruebas API/RLS reales en QA checklist.

Si un terminal no encuentra input de otro, marca:
- `DEPENDENCIAS DE OTROS: pendiente de Terminal X`

---

## 6) Conflictos y decisiones de arbitraje

Si hay conflicto entre terminales:

1. Prioridad técnica:
   - seguridad/compliance > estabilidad > velocidad > estética
2. Prioridad de negocio:
   - conversión de leads > features secundarias
3. Si persiste:
   - decide Cursor principal y deja constancia aquí.

Formato:

```txt
### CONFLICTO-[ID]
TERMINALES:
DESCRIPCION:
OPCION_ELEGIDA:
RAZON:
```

---

## 7) Log incremental por terminal

> Cada Claude agrega su bloque aquí (append-only).

### [INIT] [CURSOR-PRINCIPAL]
DECISION:
- Se crea este archivo como coordinación viva obligatoria.
CAMBIOS/PROPUESTAS:
- Protocolo unificado de no-cruce y complementariedad.
DEPENDENCIAS DE OTROS:
- N/A
RIESGOS:
- Si no actualizan este archivo, se rompe sincronización.
SIGUIENTE PASO:
- Forzar a cada terminal a leer y actualizar este archivo en cada ciclo.
ESTADO: done
INNOVACION_HOY:
- Enfocar a todos en P0 y bloqueo cero.
INNOVACION_SEMANA:
- Automatizar este log con hook de commit o script de append.

### [2026-04-20T-2] [CURSOR-PRINCIPAL]
DECISION:
- Integrar de inmediato outputs de Terminal A y B en código sin esperar más rondas.
CAMBIOS/PROPUESTAS:
- Formulario real de leads agregado a `page.tsx` (`ContactLeadForm`) con campos clave: fuente, interes, semanas, consentimiento WhatsApp.
- API `contact-leads` extendida para sincronizar opcionalmente a HubSpot (`HUBSPOT_ACCESS_TOKEN`) sin romper captura si CRM falla.
- Nuevas rutas WhatsApp 360dialog:
  - `POST /api/whatsapp`
  - `GET/POST /api/whatsapp/webhook`
- Utilidad `src/lib/whatsapp.ts` para envío template/text.
- Variables nuevas en `.env.example` y docs en `README.md`.
DEPENDENCIAS DE OTROS:
- Terminal D: debe añadir estas rutas nuevas en QA checklist.
- Terminal C: puede ajustar schema SQL para guardar `wa_consent` si se quiere persistencia completa en DB (hoy queda en sync CRM + payload validado).
RIESGOS:
- Si no está `WHATSAPP_API_KEY`, endpoints de WhatsApp responderán error al enviar.
- Si no está `HUBSPOT_ACCESS_TOKEN`, la sync CRM se omite (no bloqueante).
SIGUIENTE PASO:
- Correr lint/build y cerrar smoke checks de endpoints nuevos.
ESTADO: in_progress
INNOVACION_HOY:
- Captura de consentimiento WhatsApp desde el origen para compliance anti-baneo.
INNOVACION_SEMANA:
- Persistir `wa_consent` y `service_interest` en tabla `contact_leads` + dashboard de calidad de leads por fuente.

### [2026-04-20T-1] [TERMINAL-A]
DECISION:
- HubSpot Free confirmado. Pipeline, campos, automatizaciones y guion Diana definidos.
- No se codea CRM: Terminal A configura HubSpot UI, Terminal C codea la integración API.
CAMBIOS/PROPUESTAS:
- Pipeline 6 etapas: Lead Nueva → Contactada → Interesada → Propuesta Enviada → Inscrita / Perdida
- 6 campos custom: whatsapp, semanas_gestacion, fuente_origen, wa_consent (Contact) + servicio_interes, fecha_parto (Deal)
- Contrato API definido para Terminal C: POST contacts + POST deals con campos exactos
- 3 workflows: bienvenida inmediata, seguimiento 24h, perdida 14d
- Guion diario Diana 10 min
DEPENDENCIAS DE OTROS:
- Terminal C: implementar POST a HubSpot API (contrato definido arriba), variable env HUBSPOT_API_KEY
- Terminal B: necesita campo wa_consent para compliance 360dialog — ya incluido en contrato
RIESGOS:
- Si Diana no recibe accesos de ads a tiempo, la fuente_origen de leads pagados no se trackea automático (workaround: entrada manual)
- HubSpot Free tiene límite de 5 workflows activos — las 3 automatizaciones caben, pero no sobra mucho margen
SIGUIENTE PASO:
- Esperar accesos de ads para conectar Meta/Google Ads a HubSpot (Settings → Marketing → Ads)
- Crear email template de bienvenida (contenido pendiente de Diana)
ESTADO: done
INNOVACION_HOY:
- Campo wa_consent obligatorio desde formulario web. Terminal B lo necesita para 360dialog y es requisito legal.
INNOVACION_SEMANA:
- Lead scoring automático: puntaje por proximidad a fecha de parto + fuente de origen. Diana atiende leads calientes primero.

### [2026-04-20T-3] [CURSOR-PRINCIPAL]
DECISION:
- Cerrar integración técnica P0 con verificación real de build/lint.
CAMBIOS/PROPUESTAS:
- `npm run lint` y `npm run build` en verde.
- Endpoints activos y compilando: `/api/whatsapp`, `/api/whatsapp/webhook`, `/api/contact-leads`, `/api/courses`, `/api/enrollments`.
- Formulario de leads integrado en home con consentimiento WA y fuente de origen.
DEPENDENCIAS DE OTROS:
- Terminal D debe actualizar QA checklist con pruebas de rutas WhatsApp + formulario de lead.
RIESGOS:
- Si faltan variables `WHATSAPP_API_KEY` y `HUBSPOT_ACCESS_TOKEN`, esas integraciones quedan en modo parcial.
SIGUIENTE PASO:
- Configurar envs en Vercel y ejecutar smoke test en staging.
ESTADO: done
INNOVACION_HOY:
- Se deja sincronización CRM no bloqueante para no perder leads aunque CRM falle temporalmente.
INNOVACION_SEMANA:
- Añadir cola/reintento de sync a HubSpot para garantizar consistencia eventual.

### [2026-04-20T-4] [CURSOR-PRINCIPAL]
DECISION:
- Ejecutar deploy real de preview y registrar estado para el resto de terminales.
CAMBIOS/PROPUESTAS:
- Deploy exitoso en Vercel preview:
  - `https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app`
- Inspector:
  - `https://vercel.com/alvarogiozu-7356s-projects/neoser-app/GNz9BHXYrbNsEugfJGkL6EGYKyEz`
- `docs/staging-cutover-checklist.md` actualizado con URL preview, envs nuevos y nota de protection `401`.
DEPENDENCIAS DE OTROS:
- Terminal D: ejecutar QA cuando se habilite acceso preview (shareable link o sin protection).
RIESGOS:
- El preview actual responde `401` por Vercel Deployment Protection, impide QA externo inmediato.
SIGUIENTE PASO:
- Ajustar protection en Vercel y correr smoke tests funcionales públicos.
ESTADO: in_progress
INNOVACION_HOY:
- Registrar de inmediato links de deploy/inspector en el doc de checklist para no perder tiempo en handoff.
INNOVACION_SEMANA:
- Automatizar publicación del URL de preview en este archivo después de cada deploy.

### [2026-04-20T-5] [CURSOR-PRINCIPAL]
DECISION:
- Separar coordinación en 1 MD general + 1 MD por terminal para evitar confusión.
CAMBIOS/PROPUESTAS:
- Creados documentos vivos por rol:
  - `neoser-app/docs/revops/TERMINAL-A-REVOPS.md`
  - `neoser-app/docs/whatsapp/TERMINAL-B-WHATSAPP.md`
  - `neoser-app/docs/backend/TERMINAL-C-BACKEND.md`
  - `neoser-app/docs/delivery/TERMINAL-D-DELIVERY.md`
- Actualizada sección en este SYNC con reglas de precedencia entre documentos.
DEPENDENCIAS DE OTROS:
- Cada terminal debe empezar a loguear en su MD propio desde la próxima iteración.
RIESGOS:
- Si siguen escribiendo solo en el general, volverá el ruido.
SIGUIENTE PASO:
- Reenviar instrucción única a todos: "actualiza tu MD propio y solo resumen en SYNC".
ESTADO: done
INNOVACION_HOY:
- Desacoplar logs por rol reduce ruido y acelera handoff.
INNOVACION_SEMANA:
- Generar script que valide que cada terminal actualizó su MD antes de cerrar ciclo.

### [2026-04-20T-6] [CURSOR-PRINCIPAL]
DECISION:
- Continuar cierre operativo con QA automatizable en entorno Windows.
CAMBIOS/PROPUESTAS:
- Se añadió `scripts/smoke-test.ps1` para ejecutar smoke test sin bash.
- Se actualizó `docs/staging-cutover-checklist.md` con comando PowerShell.
- Se ejecutó smoke test sobre preview actual y devolvió `exit 2` por Deployment Protection `401`.
DEPENDENCIAS DE OTROS:
- Terminal D: usar script PS1 para QA en Windows hasta habilitar acceso preview.
RIESGOS:
- QA funcional externo sigue bloqueado mientras Vercel protection esté activa.
SIGUIENTE PASO:
- Habilitar shareable preview o desactivar protection temporal y re-ejecutar smoke test.
ESTADO: in_progress
INNOVACION_HOY:
- Compatibilidad cruzada de smoke tests (bash + PowerShell) para no bloquear la operación por OS.
INNOVACION_SEMANA:
- Agregar smoke test en Node para ejecución uniforme en cualquier runner CI.

### [2026-04-20T-2] [TERMINAL-A]
DECISION:
- Innovación operativa: 6 documentos RevOps creados en docs/revops/ que convierten HubSpot de "CRM básico" a "motor de crecimiento maternidad".
- Todo opera dentro de HubSpot Free (sin código extra, sin herramientas nuevas).
CAMBIOS/PROPUESTAS:
- 01-lifecycle-nurturing.md: Matriz de nurturing automático por semana de gestación. Mensajes y acciones mapeados a cada etapa del embarazo/postparto. Usa 2 workflows adicionales (4+5 de los 5 disponibles en Free).
- 02-speed-to-lead-sla.md: SLAs de respuesta por fuente. Ads <5min, web <15min, orgánico <2h. Métricas de cumplimiento.
- 03-reactivation-playbook.md: Sistema de 3 niveles para reactivar leads "perdidas" — en maternidad una lead perdida hoy es clienta en 3 meses. Campos nuevos: reactivation_count, do_not_contact.
- 04-referral-engine.md: Programa "Mamá recomienda Mamá" con tracking en HubSpot (campo referida_por). Costo cero, alto impacto.
- 05-weekly-dashboard-diana.md: 5 números que Diana revisa cada lunes en 5 min. Vistas y reports pre-configurados.
- 06-cross-sell-lifecycle.md: Mapa de siguiente servicio por ciclo de vida. Deal automático de cross-sell al cerrar inscripción. Sube LTV de 1 compra a 2-3.
DEPENDENCIAS DE OTROS:
- Terminal C: campos adicionales sugeridos (reactivation_count, do_not_contact, referida_por, siguiente_servicio) son P1, no bloquean P0.
- Terminal B: las plantillas de nurturing por etapa de vida requieren templates aprobados en 360dialog (coordinación P1).
RIESGOS:
- HubSpot Free tiene límite de 5 workflows. Con 3 operativos + 2 lifecycle = 5/5 usados. Si necesitamos más, hay que priorizar o subir a Starter ($20/mes).
- Cross-sell automático (deal auto-creado al cerrar) puede no estar disponible en Free — verificar al configurar. Workaround: Diana lo crea manual (30 seg).
SIGUIENTE PASO:
- Documentación entregada. Esperar que Diana provea: contenido para emails (PDF bienvenida, emails educativos), accesos de ads.
- P1: implementar lead scoring + conectar nurturing con templates de Terminal B.
ESTADO: done
INNOVACION_HOY:
- Lifecycle nurturing por semana de gestación — transforma el pipeline de "reactivo" (Diana responde) a "proactivo" (el sistema anticipa necesidades). Ningún CRM genérico hace esto out-of-the-box.
INNOVACION_SEMANA:
- Cross-sell automático: al cerrar una inscripción, el sistema ya prepara la siguiente venta. Aumenta LTV sin costo de adquisición adicional.

### [2026-04-20T-1] [TERMINAL-D]
DECISION:
- Auditoria completa del codigo real. DELIVERY-QA-STAGING.md v1 creado.
CAMBIOS/PROPUESTAS:
- Checklist staging (4 env vars), QA funcional, rollback 4 niveles, mensaje cliente.
DEPENDENCIAS DE OTROS:
- Terminal C: schema SQL (RESUELTO en T-1 Terminal C).
ESTADO: done

### [2026-04-20T-2] [TERMINAL-D]
DECISION:
- Reauditoria completa post-integracion Cursor Principal + Terminal C. Build local verificado: 0 errores, 11 rutas.
- DELIVERY-QA-STAGING.md reescrito a v2 con cobertura completa del estado real.
- Smoke test script creado: scripts/smoke-test.sh
CAMBIOS/PROPUESTAS:
- DELIVERY-QA-STAGING.md v2:
  - Staging: 7 env vars (3 nuevas: HUBSPOT_ACCESS_TOKEN, WHATSAPP_API_KEY, WHATSAPP_WEBHOOK_SECRET)
  - QA expandido: +7 tests formulario leads, +4 tests login, +5 tests APIs WhatsApp, +6 checks seguridad
  - Curls actualizados con campos nuevos (waConsent, gestationWeeks, serviceInterest, expectedDueDate)
  - Rollback +1 nivel: desactivar integracion especifica via env var
  - Mensaje cliente v2: incluye formulario, login, HubSpot sync, WhatsApp auto-reply, pipeline CRM, RevOps
- scripts/smoke-test.sh: 10 checks automatizados en < 30s. Uso: `./scripts/smoke-test.sh https://url.vercel.app`
DEPENDENCIAS DE OTROS:
- Terminal C entrego schema SQL con 9 campos + trigger + middleware con rol -> BLOCKER RESUELTO. QA de APIs ya es ejecutable.
- Falta ejecutar schema.sql en Supabase Dashboard para que APIs respondan 201 en staging (paso operativo, no de codigo).
RIESGOS:
- Smoke test inserta lead real "Smoke Test" en Supabase. Considerar cleanup o flag de test en P1.
- Middleware de Terminal C ahora hace query a profiles por request a /admin. OK para MVP, monitorear latencia.
SIGUIENTE PASO:
- Ejecutar smoke-test.sh contra URL real de staging post-deploy + post-schema-SQL.
- Validar responsive manualmente en dispositivo real.
ESTADO: done
INNOVACION_HOY:
- Smoke test script ejecutable: valida 10 endpoints criticos en 30 segundos post-deploy. Cualquiera puede correrlo.
INNOVACION_SEMANA:
- GitHub Action post-deploy (on: deployment_status) que corra smoke-test.sh automaticamente y notifique por Slack si falla.

### [2026-04-20T-1] [TERMINAL-C]
DECISION:
- Completar los 5 gaps P0 de backend: schema SQL alineado con campos de Terminal A, trigger auto-profile, middleware admin con chequeo de rol, auth flow completo, callback route.
CAMBIOS/PROPUESTAS:
- `supabase/schema.sql`: agregados campos `gestation_weeks` (smallint), `service_interest` (text), `expected_due_date` (date) en `contact_leads` — alineado con contrato de Terminal A y schema Zod del Cursor principal.
- `supabase/schema.sql`: trigger `handle_new_user()` que auto-crea fila en `profiles` al signup. Sin esto, las políticas RLS que chequean `profiles.role` no funcionan para usuarios nuevos.
- `src/lib/supabase/middleware.ts`: middleware ahora verifica ROL admin (query a `profiles`), no solo sesión. Student autenticado ya NO entra a `/admin`.
- `src/app/api/contact-leads/route.ts`: INSERT ahora incluye `wa_consent`, `gestation_weeks`, `service_interest`, `expected_due_date` — antes solo persistía 5 campos, ahora persiste los 9.
- `src/app/login/page.tsx` + `actions.ts`: auth flow completo con login/signup vía Server Actions.
- `src/app/api/auth/callback/route.ts`: manejo del code exchange para confirmación de email.
- `src/proxy.ts`: matcher expandido a `["/admin/:path*", "/login"]`.
- TypeScript compila sin errores (`tsc --noEmit` = 0 errors).
DEPENDENCIAS DE OTROS:
- Terminal D: puede ejecutar QA de APIs — las tablas ya están definidas, RLS lista, auth flow funcional.
- Cursor principal: ya había integrado HubSpot sync y formulario; mi cambio complementa con persistencia DB completa.
RIESGOS:
- El trigger `handle_new_user` requiere ejecutar el SQL en Supabase. Si se ejecuta parcialmente (sin trigger), RLS por rol falla para usuarios nuevos.
- El middleware hace una query extra a `profiles` por cada request a `/admin` — aceptable para MVP, en P1 se puede cachear en JWT custom claim.
SIGUIENTE PASO:
- Ejecutar `schema.sql` completo en Supabase Dashboard (SQL Editor).
- Terminal D puede correr los curls de QA una vez el schema esté en Supabase.
ESTADO: done
INNOVACION_HOY:
- Trigger `handle_new_user` con `security definer` — elimina el race condition donde un usuario se registra pero no tiene profile, causando que RLS devuelva datos vacíos.
INNOVACION_SEMANA:
- Custom JWT claims para rol (via Supabase auth.hook): elimina la query extra en middleware y permite RLS basada en `auth.jwt() ->> 'role'` sin join a profiles.

### [2026-04-20T-3] [TERMINAL-A]
DECISION:
- Migrado doc vivo a ubicación oficial neoser-app/docs/revops/TERMINAL-A-REVOPS.md con contenido completo consolidado.
- Prompts individuales por terminal agregados en sección 9 del SYNC.
DEPENDENCIAS DE OTROS: ninguna nueva.
SIGUIENTE PASO: Esperar inputs externos (accesos ads Diana, contenido emails). P0 de Terminal A 100% cerrado.
ESTADO: done

### [2026-04-20T-3] [TERMINAL-D]
DECISION:
- Reauditoria post-Terminal B y C. Migrado a doc vivo. QA ampliado a 51 tests.
CAMBIOS/PROPUESTAS:
- TERMINAL-D-DELIVERY.md completo. DELIVERY-QA-STAGING.md v3. smoke-test.sh 12 checks. Mensaje cliente v3 con URL real.
DEPENDENCIAS DE OTROS:
- Blocker: Vercel preview 401. Schema SQL pendiente de ejecutar en Supabase.
ESTADO: done

### [2026-04-20T-1] [TERMINAL-B]
DECISION:
- Implementar P0 de WhatsApp sobre código existente: opt-out compliance, bienvenida automática post-lead, webhook robusto, documentación operativa.
- NO se re-arquitectó nada. Se complementó lo que Cursor-Principal ya integró.
CAMBIOS/PROPUESTAS:
- `src/lib/whatsapp.ts`: agregado NEOSER_TEMPLATES (constantes de nombres de plantilla) y sendWelcomeIfConsented() que solo envía si wa_consent=true.
- `src/app/api/whatsapp/webhook/route.ts`: reescrito con: opt-out automático (keywords SALIR/PARAR/STOP), check de opt-out en DB antes de responder, routing por intent (cursos/precios/pagos/horarios/default), manejo silencioso de status updates, mensaje de opt-out incluido en cada respuesta.
- `src/app/api/contact-leads/route.ts`: conectado sendWelcomeIfConsented() post-insert (fire-and-forget, no bloquea lead capture).
- `supabase/schema.sql`: agregada tabla wa_opt_outs (phone PK, opted_out_at) con RLS.
- `docs/whatsapp/01-plantillas-360dialog.md`: 5 plantillas listas para registrar en 360dialog con variables, categorías y notas.
- `docs/whatsapp/02-politica-anti-baneo.md`: 10 reglas operativas, protocolo emergencia, checklist diario Diana.
- `docs/whatsapp/03-checklist-golive.md`: 7 bloques con comandos curl listos para testing.
DEPENDENCIAS DE OTROS:
- Terminal C: tabla wa_opt_outs agregada al schema.sql — si ya ejecutó schema en Supabase, debe correr el SQL adicional (incluido en docs/whatsapp/03-checklist-golive.md bloque 4).
- Terminal A: plantillas mapean a pipeline HubSpot (bienvenida=Lead Nueva, seguimiento=Contactada, reactivacion=Perdida 14d).
- Terminal D: agregar tests de opt-out y bienvenida automática a QA checklist.
RIESGOS:
- RLS de wa_opt_outs usa `using (true)` para inserts desde server — Terminal C debe verificar que anon key no expone la tabla.
- Plantillas Meta tardan 1-24h en aprobarse. Bienvenida automática depende de aprobación de `neoser_bienvenida`.
SIGUIENTE PASO:
- Registrar plantillas en 360dialog (requiere acceso Diana a Facebook Business Manager).
- Post-aprobación: test e2e siguiendo docs/whatsapp/03-checklist-golive.md.
ESTADO: done
INNOVACION_HOY:
- Opt-out automático en webhook con persistencia en DB. Cada respuesta incluye "Responde SALIR". Control anti-baneo más crítico ya funcional en código.
INNOVACION_SEMANA:
- Webhook enriquecido: al recibir mensaje de número nuevo, auto-crear lead en contact_leads con source="whatsapp_directo" y wa_consent=true (consent implícito por ToS Meta cuando el usuario inicia conversación). Captura leads que llegan por WhatsApp sin pasar por formulario web.

### [2026-04-20T-2] [TERMINAL-B]
DECISION:
- Documento vivo TERMINAL-B-WHATSAPP.md creado con formato completo. Consumido contexto de Terminal A (lifecycle nurturing) para mapear plantillas a pipeline.
- Confirmado: RLS de wa_opt_outs corregida por Cursor/C (service_role bypass, solo admin read). Webhook ya usa createServiceClient(). Sin conflictos.
DEPENDENCIAS DE OTROS:
- Terminal A: pendiente contenido de Diana (emails, PDF bienvenida) para complementar plantillas WhatsApp.
- Acceso de Diana a Facebook Business Manager bloquea registro de plantillas en 360dialog.
RIESGOS: ninguno nuevo. RLS ya segura.
SIGUIENTE PASO: esperar acceso Diana a FB Business Manager para registrar plantillas. P0 codigo de Terminal B 100% cerrado.
ESTADO: done

### [2026-04-20T-2] [TERMINAL-C]
DECISION:
- Auditoria seguridad + alineacion completa. 3 fixes de seguridad aplicados.
CAMBIOS/PROPUESTAS:
- FIX SEGURIDAD: wa_opt_outs RLS abierta removida. Webhook usa service_role client.
- FIX SEGURIDAD: POST /api/whatsapp protegido con auth admin.
- NUEVO: createServiceClient() en src/lib/supabase/service.ts.
- AUDIT: schema SQL vs Zod vs INSERT = 100% match (9/9 campos).
- Build verde: 13 rutas, 0 errores.
- TERMINAL-C-BACKEND.md completo con schema, RLS, 7 contratos API, env vars.
DEPENDENCIAS DE OTROS:
- Terminal D: env var SUPABASE_SERVICE_ROLE_KEY requerida en Vercel. Smoke test POST /api/whatsapp ahora necesita auth admin.
- Terminal B: riesgo RLS de T-1 RESUELTO.
RIESGOS:
- Sin SUPABASE_SERVICE_ROLE_KEY en Vercel, webhook opt-out no persiste.
SIGUIENTE PASO:
- Ejecutar schema.sql en Supabase. Configurar SUPABASE_SERVICE_ROLE_KEY en Vercel.
ESTADO: done
INNOVACION_HOY:
- Service client separado evita exponer RLS abierta en tablas sensibles.
INNOVACION_SEMANA:
- Rate limiting en POST /api/contact-leads (5 req/min por IP) para evitar spam.

### [2026-04-20T-3] [TERMINAL-B]
DECISION:
- Auditoria completa: 5 archivos de codigo verificados contra docs. 3 fixes aplicados en docs desactualizados.
CAMBIOS/PROPUESTAS:
- FIX: 03-checklist-golive.md SQL corregido (removida policy abierta, alineado con fix Terminal C T-2).
- FIX: 03-checklist-golive.md curl actualizado con nota auth admin (POST /api/whatsapp).
- FIX: 03-checklist-golive.md env var SUPABASE_SERVICE_ROLE_KEY agregada a Bloque 1.
- TERMINAL-B-WHATSAPP.md reescrito con estado auditado, riesgos resueltos marcados, flujos verificados.
DEPENDENCIAS DE OTROS: ninguna nueva. Riesgos previos (RLS, auth) todos resueltos por Terminal C T-2.
SIGUIENTE PASO: solo acciones externas (Diana + FB Business Manager). P0 codigo Terminal B 100% cerrado y auditado.
ESTADO: done

### [2026-04-20T-3] [TERMINAL-C]
DECISION:
- Verificacion exhaustiva MD vs codigo fuente (12 archivos). P0 backend CERRADO.
CAMBIOS/PROPUESTAS:
- TERMINAL-C-BACKEND.md: seccion "Estado verificado contra codigo" con checklist completo (schema, rutas, auth, env vars, Zod alignment).
- FIX DOC: respuesta 500 "Error inesperado" faltante en contrato POST /api/contact-leads.
- Resultado: 100% match en 5 tablas, 11 RLS policies, 7 endpoints, 6 env vars, 3 Zod schemas.
DEPENDENCIAS DE OTROS:
- Terminal D: TERMINAL-C-BACKEND.md tiene checklist verificado para usar como baseline QA.
RIESGOS: ninguno nuevo.
SIGUIENTE PASO: P0 backend completo. Accion operativa: ejecutar schema.sql en Supabase + SUPABASE_SERVICE_ROLE_KEY en Vercel.
ESTADO: done

### [2026-04-20T-4] [TERMINAL-D]
DECISION:
- Auditoria de integridad: todos los archivos referenciados verificados contra filesystem real.
- FIX: POST /api/whatsapp ahora requiere auth admin (Terminal C T-2). QA y smoke tests corregidos.
CAMBIOS/PROPUESTAS:
- TERMINAL-D-DELIVERY.md reescrito: build 11->13 rutas, QA 51->53 tests (+2 /api/whatsapp auth split), +1 check seguridad.
- smoke-test.sh: check /api/whatsapp corregido de 400 a 401 (sin auth).
- smoke-test.ps1: sincronizado con .sh (webhook opt-out + generico agregados, whatsapp 400->401).
- DELIVERY-QA-STAGING.md: /api/whatsapp tests reescritos (401 sin auth, 403 sin rol, 200 admin).
DEPENDENCIAS DE OTROS:
- Blocker activo: Vercel preview 401 Deployment Protection. Schema SQL pendiente de ejecutar en Supabase.
SIGUIENTE PASO:
- Desactivar protection o generar shareable link. Ejecutar smoke tests.
ESTADO: done

### [2026-04-20T-4] [TERMINAL-A]
DECISION:
- Auditoría de archivos: 6 docs de innovación existían solo en docs/revops/ (raíz), no en neoser-app/docs/revops/ (ubicación oficial). Corregido.
CAMBIOS:
- Creados 6 archivos reales en neoser-app/docs/revops/ (01 a 06). TERMINAL-A-REVOPS.md reescrito con rutas correctas, bloqueos explícitos y estado verificado.
DEPENDENCIAS: todo P0 de config HubSpot bloqueado por accesos de Diana (cuenta HubSpot, ads, FB Business Manager, contenido emails).
ESTADO: done

### [2026-04-20T-7] [CURSOR-PRINCIPAL]
DECISION:
- Cerrar inconsistencias documentales restantes en todos los frentes.
CAMBIOS/PROPUESTAS:
- Creados archivos faltantes:
  - `neoser-app/docs/whatsapp/01-plantillas-360dialog.md`
  - `neoser-app/docs/whatsapp/02-politica-anti-baneo.md`
  - `neoser-app/docs/whatsapp/03-checklist-golive.md`
  - `neoser-app/DELIVERY-QA-STAGING.md`
- Corregido changelog en `TERMINAL-D-DELIVERY.md` (PS1 sincronizado).
DEPENDENCIAS DE OTROS:
- Ninguna técnica de documentación; quedan pendientes operativos de despliegue.
RIESGOS:
- Persisten bloqueos externos: `401` de preview protegido y ejecución de `schema.sql` en Supabase real.
SIGUIENTE PASO:
- Resolver acceso preview + ejecutar schema + confirmar env vars para QA final.
ESTADO: done

### [2026-04-20T-4] [TERMINAL-C] — CRM MVP
DECISION:
- CRM interno MVP completo. No HubSpot como core. CRM nativo en Supabase + Next.js.
CAMBIOS/PROPUESTAS:
- Schema: 6 columnas CRM en contact_leads (lead_status, next_followup_at, assigned_to, utm_source/medium/campaign, gclid) + tabla lead_notes.
- RLS: Admin update contact_leads + Admin manage lead_notes.
- Migration: supabase/migrations/001_crm_fields.sql (incremental para DBs existentes).
- Zod: leadStatusSchema, updateLeadSchema, createLeadNoteSchema.
- API: GET /api/contact-leads (filtros), GET/PATCH /api/contact-leads/[id], GET/POST /api/lead-notes.
- UI: /admin reescrito como CRM dashboard (tabla leads, filtros status/source, cambio estado, followup, notas).
- Build: 15 rutas, 0 errores TS, lint limpio.
DEPENDENCIAS DE OTROS:
- Terminal D: nuevas rutas CRM deben agregarse a QA/smoke tests.
- Operativo: ejecutar 001_crm_fields.sql en Supabase Dashboard si schema.sql ya fue ejecutado antes.
RIESGOS:
- Si schema no se ejecuta, GET /api/contact-leads fallara por columnas faltantes.
SIGUIENTE PASO:
- Ejecutar migration en Supabase. Deploy a Vercel. QA funcional del flujo CRM.
ESTADO: done
INNOVACION_HOY:
- CRM interno elimina dependencia de HubSpot. Diana opera desde /admin sin salir de la app.
INNOVACION_SEMANA:
- Dashboard con metricas (leads por estado, tiempo promedio de respuesta, conversion rate por fuente).

---

## 8) Prompt estándar para TODOS los Claudes

Copiar y pegar al inicio de cada terminal:

```txt
Lee COMPLETO el archivo SYNC-CLAUDES-NEOSER.md antes de responder.
Reglas obligatorias:
1) Respeta tu scope y no cruces trabajo de otros terminales.
2) Complementa, no dupliques.
3) Propón innovación útil compatible con stack actual.
4) Al terminar tu iteración, actualiza SYNC-CLAUDES-NEOSER.md en la sección "Log incremental por terminal" con el formato obligatorio.
5) Si hay conflicto o dependencia, regístralo en secciones 6 o 7.
6) Enfócate en P0 de hoy, sin re-arquitectura.
```

---

## 9) Prompts individuales por terminal (copiar y pegar en cada Claude)

> Cada prompt incluye: reglas base + rol + scope exacto + contexto existente + entregable obligatorio.
> Instrucción clave: cada terminal debe crear su TERMINAL-X-*.md como documento vivo.

### Prompt Terminal B — WhatsApp API (360dialog)

```txt
Lee COMPLETO el archivo SYNC-CLAUDES-NEOSER.md antes de responder.
Reglas obligatorias:
1) Respeta tu scope y no cruces trabajo de otros terminales.
2) Complementa, no dupliques.
3) Propón innovación útil compatible con stack actual.
4) Al terminar tu iteración, actualiza SYNC-CLAUDES-NEOSER.md en la sección "Log incremental por terminal" con el formato obligatorio.
5) Si hay conflicto o dependencia, regístralo en secciones 6 o 7.
6) Enfócate en P0 de hoy, sin re-arquitectura.

Eres Terminal B — WhatsApp API (360dialog).

Tu scope EXACTO:
- Estrategia oficial anti-baneo (quality rating, warm-up, límites)
- Plantillas de mensaje para aprobación de Meta (HSM templates)
- Flujo webhook de recepción y envío de mensajes
- Checklist go-live de WhatsApp Business API

NO TOCAR: pipeline CRM (Terminal A), código backend de APIs genéricas (Terminal C), QA/deploy (Terminal D).

Contexto que DEBES consumir:
- Terminal A: 6 etapas pipeline, campo wa_consent, docs/revops/TERMINAL-A-REVOPS.md, docs/revops/01-lifecycle-nurturing.md (matriz de mensajes por semana gestación).
- Terminal C: endpoints /api/whatsapp y /api/whatsapp/webhook ya implementados. Env var: WHATSAPP_API_KEY.

Entregable obligatorio:
1. Crear/actualizar docs/whatsapp/TERMINAL-B-WHATSAPP.md (documento vivo: rol, scope, entregados, contratos, changelog).
2. Plantillas HSM exactas (nombre, categoría, idioma, body, variables, botones).
3. Reglas anti-baneo (warm-up, límites, quality rating).
4. Flujo webhook (mensaje llega → cómo se rutea → qué se responde).
5. Checklist go-live WhatsApp.
6. Innovar: 1 mejora hoy + 1 para la semana.

Al terminar: actualizar SYNC-CLAUDES-NEOSER.md Y TERMINAL-B-WHATSAPP.md.
```

### Prompt Terminal C — Backend Técnico

```txt
Lee COMPLETO el archivo SYNC-CLAUDES-NEOSER.md antes de responder.
Reglas obligatorias:
1) Respeta tu scope y no cruces trabajo de otros terminales.
2) Complementa, no dupliques.
3) Propón innovación útil compatible con stack actual.
4) Al terminar tu iteración, actualiza SYNC-CLAUDES-NEOSER.md en la sección "Log incremental por terminal" con el formato obligatorio.
5) Si hay conflicto o dependencia, regístralo en secciones 6 o 7.
6) Enfócate en P0 de hoy, sin re-arquitectura.

Eres Terminal C — Backend Técnico.

Tu scope EXACTO:
- SQL schemas + migraciones Supabase
- RLS policies
- Contratos API (rutas, validación Zod, responses)
- Auth flow (login, signup, callback, middleware admin)
- Integración técnica con HubSpot API y WhatsApp API (el código, no la estrategia)

NO TOCAR: estrategia comercial/copy (Terminal A), estrategia WhatsApp/templates (Terminal B), QA/deploy (Terminal D).

Contexto que DEBES consumir:
- Terminal A: contrato API HubSpot con campos exactos en docs/revops/TERMINAL-A-REVOPS.md. Campos P1 sugeridos: referida_por, do_not_contact, reactivation_count, siguiente_servicio.
- Terminal B: tabla wa_opt_outs, webhook routing, plantillas en docs/whatsapp/.
- Cursor principal: formulario de leads con wa_consent y fuente_origen ya integrado.
- Tu iteración T-1 ya entregó: schema SQL, trigger handle_new_user, middleware admin, auth flow. Revisa gaps post-integración.

Entregable obligatorio:
1. Crear/actualizar docs/backend/TERMINAL-C-BACKEND.md (documento vivo: rol, scope, entregados, schema actual, endpoints con request/response, contratos, changelog).
2. Verificar schema SQL vs contrato Terminal A vs schema Zod — 100% match.
3. Verificar RLS: admin=todo, anon=INSERT contact_leads, student=solo suyo, wa_opt_outs=segura.
4. Documentar endpoints exactos con request/response para QA de Terminal D.
5. Innovar: 1 mejora hoy + 1 para la semana.

Al terminar: actualizar SYNC-CLAUDES-NEOSER.md Y TERMINAL-C-BACKEND.md.
```

### Prompt Terminal D — Delivery/QA/Go-live

```txt
Lee COMPLETO el archivo SYNC-CLAUDES-NEOSER.md antes de responder.
Reglas obligatorias:
1) Respeta tu scope y no cruces trabajo de otros terminales.
2) Complementa, no dupliques.
3) Propón innovación útil compatible con stack actual.
4) Al terminar tu iteración, actualiza SYNC-CLAUDES-NEOSER.md en la sección "Log incremental por terminal" con el formato obligatorio.
5) Si hay conflicto o dependencia, regístralo en secciones 6 o 7.
6) Enfócate en P0 de hoy, sin re-arquitectura.

Eres Terminal D — Delivery / QA / Go-live.

Tu scope EXACTO:
- Checklist de staging (Vercel env vars, deploy)
- QA funcional (landing, formulario, APIs, admin, responsive, SEO básico)
- Plan de rollback (niveles y procedimiento)
- Mensaje de entrega al cliente (Diana)
- Smoke tests

NO TOCAR: schema SQL/arquitectura (Terminal C), estrategia CRM (Terminal A), estrategia WhatsApp (Terminal B).

Contexto que DEBES consumir:
- Terminal C: schema SQL, auth flow, middleware admin, endpoints API. Ver docs/backend/TERMINAL-C-BACKEND.md.
- Terminal B: tabla wa_opt_outs, webhook modificado, opt-out flow. Agregar a QA.
- Env vars requeridas: HUBSPOT_ACCESS_TOKEN (Terminal A), WHATSAPP_API_KEY (Terminal B), SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (Terminal C).
- Build/lint en verde (Cursor principal).
- Tus iteraciones previas: DELIVERY-QA-STAGING.md y smoke-test.sh. Actualizar con endpoints nuevos.

Entregable obligatorio:
1. Crear/actualizar docs/delivery/TERMINAL-D-DELIVERY.md (documento vivo: rol, scope, entregados, estado QA, checklist, changelog).
2. Actualizar QA checklist con endpoints de Terminal C y B (incluyendo /api/whatsapp/webhook, opt-out).
3. Verificar smoke-test.sh cubre todos los endpoints activos.
4. Preparar mensaje de entrega para Diana (versión final).
5. Innovar: 1 mejora hoy + 1 para la semana.

Al terminar: actualizar SYNC-CLAUDES-NEOSER.md Y TERMINAL-D-DELIVERY.md.
```

### Prompt Cursor Principal — Integrador

```txt
Lee COMPLETO el archivo SYNC-CLAUDES-NEOSER.md antes de responder.

Eres el Cursor Principal — Integrador.

Tu rol:
- Integrar el output de Terminal A, B, C y D.
- Resolver conflictos entre terminales.
- Ejecutar código y documentación final.
- Verificar build/lint/deploy.

Documentos vivos de cada terminal:
- docs/revops/TERMINAL-A-REVOPS.md (CRM/Operación)
- docs/whatsapp/TERMINAL-B-WHATSAPP.md (WhatsApp API)
- docs/backend/TERMINAL-C-BACKEND.md (Backend)
- docs/delivery/TERMINAL-D-DELIVERY.md (Delivery/QA)

Checklist de integración:
1. ¿Campos schema SQL (C) matchean contrato CRM (A)?
2. ¿Endpoints WhatsApp (C) soportan plantillas de (B)?
3. ¿QA checklist (D) cubre todos los endpoints activos?
4. ¿Env vars de todos los terminales están en Vercel?
5. ¿Conflictos en sección 6 del SYNC sin resolver?

Si detectas inconsistencia: no elijas un lado, regístralo en sección 6 con recomendación y razón.

Al terminar: actualizar SYNC-CLAUDES-NEOSER.md.
```
