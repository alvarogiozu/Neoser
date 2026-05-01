# Staging, QA y Cutover

## 1) Preparar staging
- Crear proyecto en Supabase (staging) y ejecutar `supabase/schema.sql`.
- Configurar variables en Vercel Preview:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `HUBSPOT_ACCESS_TOKEN` (opcional recomendado)
  - `NEXT_PUBLIC_CAL_BOOKING_URL`
  - `CAL_WEBHOOK_SIGNING_KEY`
  - `EMAIL_PROVIDER`
  - `EMAIL_API_KEY` (si provider = brevo)
  - `EMAIL_FROM`
- Deploy de rama `staging`.
- Preview generado: `https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app`
- Si responde `401`, revisar Vercel Deployment Protection para permitir QA:
  - Shareable Preview Links, o
  - desactivar temporalmente autenticacion para preview.

## 2) QA funcional
- Navegacion por secciones: `#inicio`, `#servicios`, `#cursos`, `#reserva`, `#nosotros`, `#noticias`, `#contacto`.
- Probar `GET /api/courses`.
- Probar `POST /api/contact-leads` con payload valido e invalido.
- Probar `POST /api/bookings` con payload valido e invalido.
- Probar `POST /api/bookings/cal-webhook` con firma valida/invalida.
- Probar `POST /api/email/automation` como admin.
- Probar `POST /api/enrollments` autenticado y no autenticado.
- Verificar mapa en `/contacto` con y sin API key.
- Correr smoke test:
  - Linux/macOS: `./scripts/smoke-test.sh https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app`
  - Windows PowerShell: `.\scripts\smoke-test.ps1 -BaseUrl "https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app"`
  - Si retorna `2`, hay bloqueo por Deployment Protection (401).

## 3) QA no funcional
- Lighthouse mobile/desktop.
- Revisar metadata SEO.
- Revisar responsive en 360px, 768px, 1024px y desktop.

## 4) Cutover a produccion
- Clonar esquema Supabase en produccion.
- Configurar mismas variables en Vercel Production.
- Deploy de rama principal.
- Apuntar dominio cuando checklist este verde.
- Rollback: mantener deployment anterior activo para rollback inmediato.
