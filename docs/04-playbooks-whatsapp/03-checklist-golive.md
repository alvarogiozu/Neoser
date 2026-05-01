# Checklist Go-Live WhatsApp 360dialog - NeoSer

> Tiempo estimado: 60-90 minutos (sin contar aprobacion de plantillas Meta).

---

## Bloque 1: Cuenta 360dialog (15 min)

- [ ] Crear cuenta en hub.360dialog.com
- [ ] Embedded Signup: vincular Facebook Business Manager de NeoSer
- [ ] Verificar negocio en Facebook Business (si no esta hecho)
- [ ] Registrar numero WhatsApp: +51978822368 o uno dedicado
- [ ] Copiar API Key del dashboard
- [ ] Configurar en Vercel: Settings > Environment Variables:
  - `WHATSAPP_API_KEY` = API key de 360dialog
  - `WHATSAPP_WEBHOOK_SECRET` = secreto aleatorio (min 16 chars)
  - `SUPABASE_SERVICE_ROLE_KEY` = service role key de Supabase (requerida por webhook para opt-outs)

## Bloque 2: Plantillas (10 min registro, 1-24h aprobacion)

- [ ] Crear `neoser_bienvenida` (MARKETING) — ver docs/whatsapp/01-plantillas-360dialog.md
- [ ] Crear `neoser_seguimiento` (MARKETING)
- [ ] Crear `neoser_recordatorio` (UTILITY)
- [ ] Crear `neoser_reactivacion` (MARKETING)
- [ ] Crear `neoser_confirmacion_pago` (UTILITY)
- [ ] Incluir sample values para cada variable
- [ ] Verificar que plantillas MARKETING tienen "Responde SALIR..."

## Bloque 3: Webhook (10 min)

- [ ] En 360dialog Dashboard > Settings > Webhook:
  - URL: `https://[tu-dominio-vercel]/api/whatsapp/webhook`
  - Verify token: el mismo valor de `WHATSAPP_WEBHOOK_SECRET`
- [ ] Verificar que 360dialog confirma la suscripcion (GET exitoso)

## Bloque 4: Base de datos (5 min)

- [ ] Ejecutar en Supabase SQL Editor (solo si schema.sql no fue ejecutado completo):
```sql
create table if not exists public.wa_opt_outs (
  phone text primary key,
  opted_out_at timestamptz not null default now()
);
alter table public.wa_opt_outs enable row level security;
-- No policy abierta: service_role key bypasea RLS automaticamente.
-- Solo admin puede leer opt-outs via cliente autenticado.
create policy "Admin read opt-outs" on public.wa_opt_outs for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
```
- [ ] Verificar que `SUPABASE_SERVICE_ROLE_KEY` esta configurada en Vercel (requerida por webhook para escribir opt-outs)

## Bloque 5: Testing (15 min)

- [ ] Enviar mensaje de prueba a tu numero personal (requiere sesion admin):
```bash
# Primero: iniciar sesion como admin en el sitio web para obtener cookie de sesion.
# Luego enviar con la cookie de autenticacion:
curl -X POST https://[tu-dominio]/api/whatsapp \
  -H "Content-Type: application/json" \
  -H "Cookie: [cookie-de-sesion-admin]" \
  -d '{"to":"51TUNUMERO","template":"neoser_bienvenida","params":[{"type":"text","text":"Test"}]}'
# Nota: POST /api/whatsapp requiere auth admin (Terminal C T-2).
# Sin auth devuelve 401/403.
```
- [ ] Verificar que llega al WhatsApp
- [ ] Enviar mensaje al numero registrado y verificar respuesta automatica
- [ ] Probar keyword "curso" → verificar respuesta de cursos
- [ ] Probar keyword "precio" → verificar respuesta de precios
- [ ] Probar keyword "SALIR" → verificar opt-out y confirmacion
- [ ] Enviar lead desde formulario web con wa_consent=true → verificar bienvenida llega
- [ ] Enviar lead desde formulario web con wa_consent=false → verificar que NO llega mensaje

## Bloque 6: Perfil de negocio (5 min)

- [ ] En 360dialog > Business Profile:
  - Nombre: NeoSer - Maternidad y Medicina Humanizada
  - Descripcion: Centro de maternidad y medicina humanizada en Chiclayo
  - Direccion: [direccion Chiclayo]
  - Logo: subir logo de branding/
  - Sitio web: URL de Vercel/dominio final

## Bloque 7: Go-live (5 min)

- [ ] Deploy final a Vercel con todas las env vars
- [ ] Test end-to-end desde sitio publicado
- [ ] Diana envia primer mensaje real de prueba
- [ ] Confirmar Quality Rating en verde
- [ ] Leer docs/whatsapp/02-politica-anti-baneo.md con Diana

---

## Post go-live (primeras 48h)

- [ ] Monitorear Quality Rating cada 12h
- [ ] Verificar que opt-outs se registran correctamente
- [ ] Ajustar respuestas automaticas si Diana identifica preguntas frecuentes no cubiertas
- [ ] Confirmar aprobacion de las 5 plantillas en Meta
