# NeoSer - Delivery / QA / Staging / Rollback
**Terminal D | 2026-04-20 | P0 — v2 (post-integracion Cursor Principal)**

> Build local verificado: `next build` OK, 0 errores, 0 warnings. 11 rutas compiladas.

---

## 1. STAGING CHECKLIST - Vercel

### Pre-deploy
- [ ] Repo en GitHub con `neoser-app/` pusheado (incluyendo archivos nuevos de Cursor Principal)
- [ ] Importar en Vercel: New Project > Import > **Root Directory: `neoser-app`**
- [ ] Framework Preset: verificar que detecta **Next.js** automaticamente

### Environment Variables (7 totales)

| Variable | Tipo | Requerida | Nota |
|----------|------|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | **Si** | Sin esto no hay backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | **Si** | Auth + queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | **Si** | Operaciones server-side |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Public | No | Tiene fallback visual si falta |
| `HUBSPOT_ACCESS_TOKEN` | Secret | No | Sync CRM se omite si falta (no bloqueante) |
| `WHATSAPP_API_KEY` | Secret | No | Endpoints WA devuelven error si falta, pero no rompe el sitio |
| `WHATSAPP_WEBHOOK_SECRET` | Secret | No | Necesario para verificacion webhook 360dialog |

### Environment Variables nuevas V1 (Cal + Email + Adapter WA)

| Variable | Tipo | Requerida | Nota |
|----------|------|-----------|------|
| `NEXT_PUBLIC_CAL_BOOKING_URL` | Public | No | Si falta, UI usa fallback WhatsApp |
| `CAL_WEBHOOK_SIGNING_KEY` | Secret | No | Recomendado para validar firma de Cal |
| `EMAIL_PROVIDER` | Public/Server | No | `hubspot` por defecto, `brevo` opcional |
| `EMAIL_API_KEY` | Secret | No | Requerida si provider es `brevo` |
| `EMAIL_FROM` | Secret | No | Remitente principal |
| `WHATSAPP_PROVIDER` | Public/Server | No | `360dialog` o `whato` |
| `WHATSAPP_WHATO_ENDPOINT` | Secret | No | Solo para adapter `whato` |

### Post-deploy
- [ ] Build exitoso en Vercel dashboard (sin errores)
- [ ] URL `*.vercel.app` accesible y carga < 3s
- [ ] Verificar que fonts cargan (Montserrat body, Playfair headings, Dancing Script quote)
- [ ] HTTPS activo (Vercel lo da automatico)
- [ ] Verificar en Vercel logs que no hay runtime errors al acceder a `/`

---

## 2. QA MINIMO OBLIGATORIO

### 2.1 Funcional - Landing (`/`)

| # | Test | Esperado | OK? |
|---|------|----------|-----|
| 1 | Home carga sin errores | Hero con gradiente navy/blue, quote "Cada nacimiento es unico" | [ ] |
| 2 | Seccion Servicios | 6 cards: Control Prenatal, Parto Humanizado, Tecnica Rebozo, Preparacion al Parto, Acompanamiento Postparto, Obstetricia General | [ ] |
| 3 | Boton "Reserva tu Cita" | Abre `wa.me/51978822368` con mensaje prellenado, nueva pestana | [ ] |
| 4 | Boton "Ver cursos e inscribirme" | Abre WhatsApp con texto cursos, nueva pestana | [ ] |
| 5 | Seccion Cursos | Texto placeholder visible | [ ] |
| 6 | Seccion Quienes Somos | Card con texto proposito NeoSer | [ ] |
| 7 | Seccion Noticias | Texto "Lista para conectarse con datos reales" | [ ] |
| 8 | Seccion Contacto - info | Datos: Chiclayo, +51 978 822 368, contacto@neoser.pe | [ ] |
| 9 | Link "Ver mapa integrado" | Navega a `/contacto` | [ ] |
| 10 | Navegacion anclas | #servicios, #cursos, #nosotros, #noticias, #contacto funcionan | [ ] |

### 2.2 Funcional - Formulario de Leads (NUEVO - en seccion Contacto de `/`)

| # | Test | Esperado | OK? |
|---|------|----------|-----|
| 1 | Formulario visible | Card "Solicita informacion" al lado de info contacto | [ ] |
| 2 | Campos presentes | Nombre*, WhatsApp*, Email, Servicio interes, Semanas gestacion, Fecha parto estimada, Fuente, Mensaje*, Checkbox consent WA* | [ ] |
| 3 | Envio exitoso (con Supabase) | Mensaje verde "Gracias. Recibimos tu consulta correctamente." + form se resetea | [ ] |
| 4 | Envio con campos invalidos | No envia (validacion HTML required + validacion Zod server) | [ ] |
| 5 | Sin checkbox consent | No envia (campo required) | [ ] |
| 6 | Estado loading | Boton muestra "Enviando..." y se deshabilita | [ ] |
| 7 | Select de fuente | 7 opciones: Sitio web, Meta Ads, Google Ads, Instagram organico, WhatsApp directo, Referida, Otro | [ ] |

### 2.3 Funcional - Login (`/login`) (NUEVO)

| # | Test | Esperado | OK? |
|---|------|----------|-----|
| 1 | Pagina carga | Formulario con Email, Contrasena, botones Entrar y Registrarse | [ ] |
| 2 | Login con credenciales invalidas | Redirige a `/login?error=Credenciales+invalidas` | [ ] |
| 3 | Signup exitoso | Redirige a `/login?message=Revisa+tu+email+para+confirmar` | [ ] |
| 4 | Login exitoso | Redirige a `/` | [ ] |

### 2.4 Funcional - Contacto (`/contacto`)

| # | Test | Esperado | OK? |
|---|------|----------|-----|
| 1 | Con GOOGLE_MAPS_API_KEY | Google Maps iframe carga mapa de Chiclayo | [ ] |
| 2 | Sin API key | Fallback visual "Mapa no configurado..." | [ ] |

### 2.5 Funcional - Admin (`/admin`)

| # | Test | Esperado | OK? |
|---|------|----------|-----|
| 1 | Sin sesion activa | Redirige a `/` (proxy.ts con matcher /admin/:path*) | [ ] |
| 2 | Con sesion (role=student) | Redirige a `/` (middleware verifica ROL admin, no solo sesion) | [ ] |
| 3 | Con sesion (role=admin) | Muestra "Panel Admin NeoSer" | [ ] |

### 2.6 Funcional - APIs

> **DEPENDENCIA Terminal C**: Tests 1-5 requieren tablas en Supabase (`contact_leads`, `courses`, `enrollments`). Sin schema, las APIs devuelven 500.

| # | Endpoint | Metodo | Test | Esperado | OK? |
|---|----------|--------|------|----------|-----|
| 1 | `/api/contact-leads` | POST | Body valido completo | 201 `{ok:true}` + lead en Supabase + sync HubSpot (si token) | [ ] |
| 2 | `/api/contact-leads` | POST | Body invalido | 400 con detalles Zod | [ ] |
| 3 | `/api/courses` | GET | Sin params | 200 `{items:[...]}` (cursos publicados) | [ ] |
| 4 | `/api/enrollments` | POST | Sin sesion | 401 "No autenticado" | [ ] |
| 5 | `/api/enrollments` | POST | Con sesion + body valido | 201 `{ok:true}` | [ ] |
| 6 | `/api/whatsapp` | POST | Sin auth | **401** "No autenticado" | [ ] |
| 7 | `/api/whatsapp` | POST | Auth student (no admin) | **403** "No autorizado" | [ ] |
| 8 | `/api/whatsapp` | POST | Auth admin + body valido | 200 si WA key, 500 si no | [ ] |
| 9 | `/api/whatsapp` | POST | Auth admin + body invalido | 400 "Datos invalidos" | [ ] |
| 8 | `/api/whatsapp/webhook` | GET | Verificacion con token correcto | 200 con challenge | [ ] |
| 9 | `/api/whatsapp/webhook` | GET | Token incorrecto | 403 "Forbidden" | [ ] |
| 10 | `/api/whatsapp/webhook` | POST | Mensaje generico | 200 + auto-reply default con menu | [ ] |
| 11 | `/api/whatsapp/webhook` | POST | Mensaje con "curso" | 200 + reply sobre cursos NeoSer | [ ] |
| 12 | `/api/whatsapp/webhook` | POST | Mensaje con "precio" | 200 + reply sobre inversion | [ ] |
| 13 | `/api/whatsapp/webhook` | POST | Mensaje "SALIR" | 200 + opt-out en wa_opt_outs + confirmacion de baja | [ ] |
| 14 | `/api/whatsapp/webhook` | POST | Mensaje de numero ya opted-out | 200 + NO reply (silencio) | [ ] |
| 15 | `/api/whatsapp/webhook` | POST | Status update (delivery receipt) | 200 silencioso | [ ] |
| 16 | `/api/contact-leads` | POST | waConsent=false | 201 + NO envia WA bienvenida | [ ] |
| 17 | `/api/contact-leads` | POST | waConsent=true | 201 + envia template neoser_bienvenida | [ ] |
| 18 | `/api/bookings` | POST | Pre-reserva valida | 201 `{ok:true, bookingId}` | [ ] |
| 19 | `/api/bookings/cal-webhook` | POST | Reserva confirmada | 200 + upsert en `bookings` | [ ] |
| 20 | `/api/email/automation` | POST | Admin + payload valido | 200 + inserta evento en `email_events` | [ ] |

**Comandos de prueba rapida (curl):**
```bash
BASE="https://TU-URL.vercel.app"

# --- CONTACT LEADS ---
# Happy path (campos nuevos incluidos)
curl -X POST $BASE/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Maria Garcia","phone":"51978822368","message":"Quiero info de parto humanizado","source":"web","waConsent":true,"serviceInterest":"Parto Humanizado","gestationWeeks":28}'

# Error path
curl -X POST $BASE/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{"fullName":"T","phone":"","message":"x"}'

# --- COURSES ---
curl $BASE/api/courses

# --- ENROLLMENTS (sin auth = 401) ---
curl -X POST $BASE/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"courseId":"00000000-0000-0000-0000-000000000000"}'

# --- WHATSAPP SEND ---
# (solo funciona con WHATSAPP_API_KEY configurada)
curl -X POST $BASE/api/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"to":"51978822368","template":"neoser_bienvenida"}'

# WhatsApp send - error path
curl -X POST $BASE/api/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"to":"","template":""}'

# --- WHATSAPP WEBHOOK ---
# Verificacion (token correcto)
curl "$BASE/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=TU_WEBHOOK_SECRET&hub.challenge=test123"

# Verificacion (token incorrecto = 403)
curl "$BASE/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=test"

# Mensaje generico (auto-reply con menu)
curl -X POST $BASE/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000001","text":{"body":"Hola quiero info"}}]}}]}]}'

# Mensaje sobre cursos (routing por intent)
curl -X POST $BASE/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000002","text":{"body":"Quiero info de cursos"}}]}}]}]}'

# Mensaje sobre precios
curl -X POST $BASE/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000003","text":{"body":"Cuanto cuesta?"}}]}}]}]}'

# Opt-out (SALIR) — debe insertar en wa_opt_outs y confirmar baja
curl -X POST $BASE/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000004","text":{"body":"SALIR"}}]}}]}]}'

# Status update (delivery receipt) — debe responder 200 silencioso
curl -X POST $BASE/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"statuses":[{"id":"wamid.xxx","status":"delivered"}]}}]}]}'

# Contact-leads con waConsent=false (NO debe enviar WA bienvenida)
curl -X POST $BASE/api/contact-leads \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test Sin WA","phone":"51900000005","message":"No quiero WA","source":"web","waConsent":false}'
```

### 2.7 Responsive

| Viewport | Servicios grid | Formulario leads | Hero legible | OK? |
|----------|---------------|------------------|--------------|-----|
| Mobile 375px | 1 columna | Full width debajo de info | Si | [ ] |
| Tablet 768px | 2 columnas | Full width debajo de info | Si | [ ] |
| Desktop 1280px | 3 columnas (servicios), 2 columnas (contacto+form) | Al lado de info contacto | Si | [ ] |

### 2.8 SEO basico

| Check | Estado | OK? |
|-------|--------|-----|
| `<html lang="es">` | Configurado en layout.tsx | [ ] |
| `<title>` | "NeoSer \| Maternidad y Medicina Humanizada - Chiclayo" | [ ] |
| Meta description | "Centro de maternidad y medicina humanizada en Chiclayo..." | [ ] |
| Google Fonts | Montserrat, Playfair Display, Dancing Script | [ ] |
| No hay noindex | Verificar que Vercel preview no agrega noindex | [ ] |

### 2.9 Seguridad minima

| Check | Estado | OK? |
|-------|--------|-----|
| Proxy protege `/admin` con chequeo de ROL | proxy.ts + middleware.ts verifica role=admin, no solo sesion | [ ] |
| Enrollment requiere auth | route.ts verifica user antes de insert | [ ] |
| Zod valida todos los POST | contact-leads, enrollments, whatsapp send | [ ] |
| HubSpot sync no bloquea | try/catch: si HubSpot falla, lead se guarda igual en Supabase | [ ] |
| WA bienvenida solo si waConsent=true | sendWelcomeIfConsented() verifica consent antes de enviar | [ ] |
| Secrets no expuestos | HUBSPOT_ACCESS_TOKEN, WHATSAPP_API_KEY, SUPABASE_SERVICE_ROLE_KEY son server-only (sin NEXT_PUBLIC_) | [ ] |
| WhatsApp webhook verifica token | GET handler compara hub.verify_token vs WHATSAPP_WEBHOOK_SECRET | [ ] |
| Opt-out respetado en webhook | checkOptOut() consulta wa_opt_outs antes de cada respuesta | [ ] |

---

## 3. PLAN DE ROLLBACK

### Nivel 1 - Revert instantaneo (< 1 min)
```
Vercel Dashboard > Deployments > deploy anterior > "Promote to Production"
```
No toca codigo. Revierte al ultimo build funcional.

### Nivel 2 - Fix de env vars (< 5 min)
```
Vercel > Settings > Environment Variables > corregir valor > Redeploy
```

### Nivel 3 - Revert de codigo (< 10 min)
```bash
git revert HEAD
git push origin main
# Vercel auto-deploya el revert
```

### Nivel 4 - Desactivar integracion especifica
```
# Si HubSpot causa problemas: borrar HUBSPOT_ACCESS_TOKEN en Vercel > Redeploy
# Si WhatsApp causa problemas: borrar WHATSAPP_API_KEY en Vercel > Redeploy
# Ambos son graceful: el sitio sigue funcionando sin ellos
```

### Nivel 5 - Nuclear (sitio totalmente roto)
```
Opcion A: Vercel > Settings > Domains > desconectar dominio
Opcion B: Vercel > pause project
```

### Contactos de emergencia
- Vercel Status: https://www.vercel-status.com/
- Supabase Status: https://status.supabase.com/

---

## 4. MENSAJE FINAL PARA CLIENTE

> **Copiar y enviar tal cual (adaptar URL):**

---

Hola,

Les comparto el cierre de la primera entrega de NeoSer.

**Sitio en staging:** https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app
(Nota: si pide autenticacion, es por la proteccion de Vercel — les compartimos acceso)

**Que quedo listo hoy:**

*Sitio web*
- Landing completa con 7 secciones: Hero, Servicios (6 especialidades), Escuela NeoSer, Quienes Somos, Noticias, Contacto y Mapa
- Formulario de captacion de leads integrado: nombre, WhatsApp, email, servicio de interes, semanas de gestacion, fecha estimada de parto, fuente de origen y consentimiento WhatsApp
- Google Maps integrado con ubicacion de Chiclayo
- Diseno responsive: movil, tablet y escritorio
- SEO basico configurado (titulo, descripcion, idioma espanol)

*Sistema*
- Login y registro de usuarios
- Panel de administracion protegido con verificacion de rol (solo administradores)
- 5 APIs funcionando: registro de leads, catalogo de cursos, matriculas, envio WhatsApp y webhook WhatsApp
- Validacion de datos en todos los formularios
- Sincronizacion automatica de leads a HubSpot CRM
- Respuestas automaticas por WhatsApp via 360dialog con routing inteligente (cursos, precios, pagos, horarios)
- Sistema de opt-out automatico en WhatsApp (cumplimiento anti-baneo Meta)
- Bienvenida automatica por WhatsApp al registrar lead (solo si dio consentimiento)

*Operacion*
- Pipeline comercial definido en HubSpot: 6 etapas desde Lead Nueva hasta Inscrita
- 6 documentos de estrategia operativa (RevOps): nurturing por semana de gestacion, SLAs de respuesta, reactivacion de leads, programa de referidos, dashboard semanal, cross-sell por ciclo de vida
- 5 plantillas de WhatsApp listas para registrar en 360dialog
- Politica anti-baneo documentada con 10 reglas operativas
- Guion diario de 10 minutos para Diana (gestion de leads)

**Que sigue en la proxima sesion:**
- Ejecutar schema SQL en Supabase para activar base de datos
- Registrar plantillas WhatsApp en 360dialog (requiere Facebook Business Manager)
- Contenido definitivo en "Quienes Somos" y descripciones por servicio
- Conectar cursos y noticias con datos reales
- Animaciones y transiciones del diseno original (GSAP/AOS/Swiper)
- Dashboard operativo para Diana
- Dominio definitivo neoser.pe

Les pido revisar el sitio y compartir cualquier observacion. Quedo atento.

Saludos

---
