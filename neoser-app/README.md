# NeoSer App (Next.js + Supabase)

Base de migracion de NeoSer para pasar de landing estatica a plataforma escalable con auth, APIs y datos.

## Requisitos
- Node.js 20+
- Proyecto de Supabase (staging/prod)
- Variables en `.env.local` (ver `.env.example`)

## Ejecutar local
```bash
npm install
npm run dev
```

## Variables de entorno
Copiar `.env.example` a `.env.local` y completar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `HUBSPOT_ACCESS_TOKEN` (opcional para sync CRM)
- `CAL_API_KEY` (opcional para operaciones server-side)
- `CAL_WEBHOOK_SIGNING_KEY` (recomendado para validar webhooks)
- `CAL_EVENT_TYPE_ID`
- `CAL_BOOKING_URL`
- `NEXT_PUBLIC_CAL_BOOKING_URL`
- `EMAIL_PROVIDER` (`hubspot` o `brevo`)
- `EMAIL_API_KEY`
- `EMAIL_FROM`
- `WHATSAPP_PROVIDER` (`360dialog` o `whato`)
- `WHATSAPP_API_KEY` (360dialog)
- `WHATSAPP_WEBHOOK_SECRET`

## Base de datos
Ejecutar el esquema en Supabase SQL editor:
- `supabase/schema.sql`

## Endpoints iniciales
- `GET /api/courses`
- `POST /api/contact-leads`
- `GET/POST /api/bookings`
- `POST /api/bookings/cal-webhook`
- `POST /api/enrollments` (requiere sesion)
- `POST /api/whatsapp`
- `GET/POST /api/whatsapp/webhook`

## Documentacion operativa
- Baseline de migracion: `docs/migration-baseline.md`
- QA/Staging/Cutover: `docs/staging-cutover-checklist.md`
