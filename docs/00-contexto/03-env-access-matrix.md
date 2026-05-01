# NeoSer — Matriz de accesos y variables por entorno

## 1) Entornos

- `dev`: desarrollo local.
- `staging`: validacion funcional antes de produccion.
- `prod`: entorno productivo.

## 2) Matriz de variables

| Variable | Dev | Staging | Prod | Owner | Rotacion | Notas |
|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Si | Si | Si | Alvaro | Semestral | URL base por entorno |
| `NEXT_PUBLIC_SUPABASE_URL` | Si | Si | Si | Alvaro | Anual | Proyecto Supabase por entorno |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si | Si | Si | Alvaro | Anual | Solo cliente publico |
| `SUPABASE_SERVICE_ROLE_KEY` | Si | Si | Si | Alvaro | Trimestral | Solo server, nunca exponer |
| `HUBSPOT_ACCESS_TOKEN` | Opcional | Si | Si | Diana + Alvaro | Semestral | Integracion CRM |
| `CAL_API_KEY` | Opcional | Si | Si | Diana + Alvaro | Semestral | Webhooks y operaciones de reserva |
| `CAL_WEBHOOK_SIGNING_KEY` | No | Si | Si | Alvaro | Trimestral | Verificacion de firma de eventos |
| `CAL_EVENT_TYPE_ID` | No | Si | Si | Diana | Bajo cambio | Event type principal de reservas |
| `CAL_BOOKING_URL` | Si | Si | Si | Diana | Bajo cambio | URL publica de reserva para UI |
| `NEXT_PUBLIC_CAL_BOOKING_URL` | Si | Si | Si | Diana | Bajo cambio | URL publica consumida por frontend |
| `EMAIL_PROVIDER` | Si | Si | Si | Alvaro | Bajo cambio | `hubspot` o `brevo` |
| `EMAIL_API_KEY` | Opcional | Si | Si | Alvaro | Trimestral | Segun proveedor elegido |
| `EMAIL_FROM` | Opcional | Si | Si | Diana + Alvaro | Bajo cambio | Remitente autenticado |
| `WHATSAPP_PROVIDER` | Si | Si | Si | Alvaro | Bajo cambio | `360dialog`/`whato` |
| `WHATSAPP_API_KEY` | Opcional | Si | Si | Alvaro | Trimestral | Token BSP activo |
| `WHATSAPP_WEBHOOK_SECRET` | Opcional | Si | Si | Alvaro | Trimestral | Webhook inbound |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Opcional | Opcional | Opcional | Alvaro | Anual | Si falta, usar fallback |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Si | Si | Alvaro | Bajo cambio | GA4 |
| `GSC_VERIFICATION_TOKEN` | No | Opcional | Opcional | Diana | Bajo cambio | Search Console |
| `MERCADOPAGO_ACCESS_TOKEN` | Opcional | Opcional | Opcional | Alvaro | Trimestral | Solo si pagos activos |

## 3) Matriz de acceso por plataforma

| Plataforma | Owner recomendado | Backup owner | Acceso minimo | Notas |
|---|---|---|---|---|
| GitHub | Alvaro | Hermano | Admin | Repositorio principal |
| Vercel | Alvaro | Hermano | Admin/Developer | Deploy y variables |
| Supabase | Alvaro | Hermano | Owner/Admin | DB, auth, SQL |
| HubSpot | Diana | Alvaro | Admin | Pipeline y marketing |
| Cal.com | Diana | Alvaro | Admin | Disponibilidad y tipos de cita |
| WhatsApp BSP | Diana | Alvaro | Admin | Plantillas y webhook |
| Google Analytics | Diana | Alvaro | Editor | Medicion conversiones |
| Search Console | Diana | Alvaro | Full | SEO y sitemap |
| Dominio/DNS | Diana | Alvaro | Admin | Verificacion, SSL, records |

## 4) Reglas operativas de seguridad

- Nunca subir credenciales al repositorio.
- Registrar cambios de keys/tokens con fecha y responsable.
- Mantener separacion de credenciales por entorno.
- Todo secreto server-side debe vivir en Vercel como secret.

## 5) Checklist de habilitacion inicial

- [ ] Variables de `dev` cargadas en `.env.local`.
- [ ] Variables de `staging` configuradas en Vercel Preview.
- [ ] Variables de `prod` configuradas en Vercel Production.
- [ ] Prueba de conectividad Supabase OK.
- [ ] Prueba de sync HubSpot OK.
- [ ] Prueba de webhook Cal.com OK.
- [ ] Prueba de envio de email OK.
- [ ] Prueba de webhook/provider WhatsApp OK.

