# Delivery QA Staging - NeoSer (resumen ejecutivo)

> **Canónico:** `../../../docs/05-entrega-y-qa/delivery-qa-staging.md` (versión detallada con checklist completo de Vercel, env vars, rollback, smoke tests). Este archivo es el resumen ejecutivo del estado de la app Next.js.

Estado ejecutivo de entrega en staging.

## URL Preview
- `https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app`
- Inspector: `https://vercel.com/alvarogiozu-7356s-projects/neoser-app/GNz9BHXYrbNsEugfJGkL6EGYKyEz`

## Estado actual
- Build: OK
- Lint: OK
- Bloqueo activo: preview con `401` por Deployment Protection (pendiente desactivar o generar link compartible).

## QA mínimo requerido antes de go-live
- Home, contacto, login, admin redirect.
- APIs: `contact-leads`, `courses`, `enrollments`, `bookings`, `email/automation`.
- Webhooks: `/api/bookings/cal-webhook`.
- Google Maps con y sin key.

## Scripts de smoke test
- Linux/macOS: `./scripts/smoke-test.sh <url>`
- Windows: `.\scripts\smoke-test.ps1 -BaseUrl "<url>"`

## Bloqueadores de producción
1. Ejecutar `supabase/schema.sql` en el proyecto Supabase real.
2. Confirmar env vars en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_CAL_BOOKING_URL`
   - `CAL_WEBHOOK_SIGNING_KEY`
   - `EMAIL_PROVIDER`
   - `EMAIL_FROM`
   - `HUBSPOT_ACCESS_TOKEN` (opcional)
3. Resolver `401` de preview para QA externo.

## QA adicional V1 anexo completo
- Reserva: pre-registro en `/api/bookings` + confirmacion por webhook Cal.
- CRM: sync lead y reserva hacia HubSpot no bloqueante.
- Email automation: prueba de `POST /api/email/automation` y auditoria en `email_events`.
