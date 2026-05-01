# NeoSer — Modelo de datos para reservas y email automation

## Tablas nuevas en `supabase/schema.sql`

### `bookings`

Objetivo: persistir pre-registros y reservas confirmadas de Cal.com para trazabilidad operativa y CRM.

Campos clave:

- `booking_status`: `pending | confirmed | cancelled | rescheduled`
- `cal_booking_uid`: identificador externo de Cal.com (unico)
- `cal_starts_at`, `cal_ends_at`: horario confirmado
- `lead_id`: referencia opcional a `contact_leads`

### `email_events`

Objetivo: auditoria de envios automatizados (welcome, confirmaciones, reactivaciones).

Campos clave:

- `provider`: proveedor de envio (`hubspot`, `brevo`, etc.)
- `template_key`: clave de plantilla interna
- `status`: `queued | sent | failed`
- `metadata`: payload auxiliar de proveedor

## Politicas RLS

- `bookings` permite `insert` publico y lectura/edicion solo admin.
- `email_events` lectura admin.

## Validacion recomendada despues de ejecutar schema

1. Insert publico en `bookings` via API web.
2. Confirmacion admin de lectura en dashboard interno.
3. Insercion de auditoria en `email_events` al disparar automatizacion inicial.

