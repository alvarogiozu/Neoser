# TERMINAL-D-DELIVERY

Documento vivo del Terminal D (Delivery / QA / Go-live).

## Rol y scope
- Checklist staging (Vercel env vars, deploy, verification)
- QA funcional y no funcional (landing, formulario, APIs, admin, responsive, SEO, seguridad)
- Plan de rollback (5 niveles)
- Mensaje de entrega al cliente
- Smoke tests automatizados

## Reglas de trabajo
- No tocar schema SQL ni arquitectura central.
- No redefinir estrategia CRM/WhatsApp fuera de QA operativo.
- Al cerrar cada iteracion: actualizar este archivo y luego `SYNC-CLAUDES-NEOSER.md`.

---

## Estado actual
- **Build**: verde (0 errores, **15 rutas** compiladas, incluye CRM MVP)
- **Deploy**: preview en Vercel desplegado, URL con protection 401
- **URL preview**: `https://neoser-aerwd8mrs-alvarogiozu-7356s-projects.vercel.app`
- **Inspector**: `https://vercel.com/alvarogiozu-7356s-projects/neoser-app/GNz9BHXYrbNsEugfJGkL6EGYKyEz`
- **Blocker**: 401 Deployment Protection impide QA externo

---

## Entregables

### 1. STAGING CHECKLIST - Vercel

#### Pre-deploy
- [x] Build local verificado (`next build` = 0 errores, 13 rutas)
- [x] Lint verificado (`npm run lint` = 0 errores)
- [ ] Repo en GitHub con todos los archivos nuevos pusheados
- [x] Importar en Vercel con Root Directory: `neoser-app`
- [x] Framework: Next.js detectado automaticamente

#### Environment Variables (7 totales)

| Variable | Tipo | Requerida | Nota |
|----------|------|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | **Si** | Sin esto no hay backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | **Si** | Auth + queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | **Si** | service client para webhook opt-out + operaciones admin |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Public | No | Tiene fallback visual |
| `HUBSPOT_ACCESS_TOKEN` | Secret | No | Sync CRM se omite gracefully si falta |
| `WHATSAPP_API_KEY` | Secret | No | Endpoints WA devuelven error si falta, sitio no se rompe |
| `WHATSAPP_WEBHOOK_SECRET` | Secret | No | Verificacion webhook 360dialog |

#### Post-deploy
- [ ] URL accesible y carga < 3s
- [ ] Fonts cargan (Montserrat body, Playfair headings, Dancing Script quote)
- [ ] HTTPS activo
- [ ] No runtime errors en Vercel logs al acceder a `/`
- [ ] Deployment Protection desactivada o shareable link generado para QA

#### Prerequisito critico
- [ ] **Ejecutar `supabase/schema.sql` en Supabase Dashboard** (SQL Editor). Sin esto, todas las APIs devuelven 500.

---

### 2. QA CHECKLIST COMPLETO

#### 2.1 Landing (`/`) — 10 tests

| # | Test | Esperado |
|---|------|----------|
| 1 | Home carga | Hero gradiente navy/blue, quote "Cada nacimiento es unico" |
| 2 | Servicios | 6 cards: Control Prenatal, Parto Humanizado, Tecnica Rebozo, Preparacion al Parto, Acompanamiento Postparto, Obstetricia General |
| 3 | "Reserva tu Cita" | Abre wa.me/51978822368 con mensaje prellenado |
| 4 | "Ver cursos e inscribirme" | Abre WhatsApp con texto cursos |
| 5 | Cursos | Texto placeholder visible |
| 6 | Quienes Somos | Card con proposito NeoSer |
| 7 | Noticias | "Lista para conectarse con datos reales" |
| 8 | Contacto info | Chiclayo, +51 978 822 368, contacto@neoser.pe |
| 9 | "Ver mapa integrado" | Navega a /contacto |
| 10 | Anclas | #servicios, #cursos, #nosotros, #noticias, #contacto |

#### 2.2 Formulario de Leads (seccion Contacto de `/`) — 7 tests

| # | Test | Esperado |
|---|------|----------|
| 1 | Formulario visible | Card "Solicita informacion" al lado de info contacto |
| 2 | Campos presentes | Nombre*, WhatsApp*, Email, Servicio interes, Semanas gestacion, Fecha parto, Fuente (7 opciones), Mensaje*, Checkbox consent WA* |
| 3 | Envio exitoso | "Gracias. Recibimos tu consulta correctamente." + form reset |
| 4 | Campos invalidos | No envia (HTML required + Zod server) |
| 5 | Sin checkbox consent | No envia (required) |
| 6 | Estado loading | "Enviando..." + boton deshabilitado |
| 7 | Select fuente | Sitio web, Meta Ads, Google Ads, Instagram organico, WhatsApp directo, Referida, Otro |

#### 2.3 Login (`/login`) — 4 tests

| # | Test | Esperado |
|---|------|----------|
| 1 | Pagina carga | Formulario Email + Contrasena + Entrar + Registrarse |
| 2 | Login invalido | Redirige /login?error=Credenciales+invalidas |
| 3 | Signup exitoso | Redirige /login?message=Revisa+tu+email+para+confirmar |
| 4 | Login exitoso | Redirige a / |

#### 2.4 Contacto (`/contacto`) — 2 tests

| # | Test | Esperado |
|---|------|----------|
| 1 | Con GOOGLE_MAPS_API_KEY | iframe Google Maps carga Chiclayo |
| 2 | Sin API key | Fallback "Mapa no configurado..." |

#### 2.5 Admin (`/admin`) — 3 tests

| # | Test | Esperado |
|---|------|----------|
| 1 | Sin sesion | Redirige a / |
| 2 | Con sesion (role=student) | Redirige a / (middleware verifica ROL admin) |
| 3 | Con sesion (role=admin) | Muestra "Panel Admin NeoSer" |

#### 2.6 APIs — 16 tests

| # | Endpoint | Metodo | Test | Esperado |
|---|----------|--------|------|----------|
| 1 | /api/contact-leads | POST | Body valido completo | 201 + lead en Supabase + HubSpot sync + WA bienvenida |
| 2 | /api/contact-leads | POST | Body invalido | 400 con Zod errors |
| 3 | /api/contact-leads | POST | waConsent=false | 201 + NO envia WA bienvenida |
| 4 | /api/courses | GET | Sin params | 200 {items:[...]} |
| 5 | /api/enrollments | POST | Sin sesion | 401 "No autenticado" |
| 6 | /api/enrollments | POST | Con sesion + body valido | 201 |
| 7 | /api/whatsapp | POST | Sin auth | **401** "No autenticado" |
| 8 | /api/whatsapp | POST | Auth student (no admin) | **403** "No autorizado" |
| 9 | /api/whatsapp | POST | Auth admin + body valido | 200 si WA key, 500 si no |
| 10 | /api/whatsapp | POST | Auth admin + body invalido | 400 "Datos invalidos" |
| 11 | /api/whatsapp/webhook | GET | Token correcto | 200 con challenge |
| 12 | /api/whatsapp/webhook | GET | Token incorrecto | 403 "Forbidden" |
| 13 | /api/whatsapp/webhook | POST | Mensaje generico | 200 + auto-reply con menu |
| 14 | /api/whatsapp/webhook | POST | Mensaje con "curso" | 200 + reply sobre cursos |
| 15 | /api/whatsapp/webhook | POST | Mensaje "SALIR" | 200 + opt-out en wa_opt_outs + confirmacion |
| 16 | /api/whatsapp/webhook | POST | Status update (delivery receipt) | 200 silencioso |

> **Nota**: POST /api/whatsapp ahora requiere auth admin (Terminal C T-2). Tests sin auth devuelven 401, sin rol admin devuelven 403.

#### 2.7 Responsive — 3 viewports

| Viewport | Servicios | Formulario | Hero |
|----------|-----------|------------|------|
| Mobile 375px | 1 col | Full width debajo de info | Legible |
| Tablet 768px | 2 col | Full width debajo de info | Legible |
| Desktop 1280px | 3 col (servicios), 2 col (contacto+form) | Al lado de info | Legible |

#### 2.8 SEO — 5 checks

| Check | Estado |
|-------|--------|
| `<html lang="es">` | Configurado |
| `<title>` NeoSer | Configurado |
| Meta description | Configurado |
| Google Fonts | 3 fonts configuradas |
| No noindex en preview | Verificar |

#### 2.9 Seguridad — 9 checks

| Check | Estado |
|-------|--------|
| Proxy protege /admin con chequeo de ROL | proxy.ts + middleware.ts |
| Enrollment requiere auth | route.ts verifica user |
| POST /api/whatsapp requiere auth admin | auth + profile.role check |
| Zod valida todos los POST | contact-leads, enrollments, whatsapp |
| HubSpot sync no bloquea lead capture | try/catch aislado |
| WA bienvenida solo si waConsent=true | sendWelcomeIfConsented |
| Secrets no expuestos (sin NEXT_PUBLIC_) | HUBSPOT, WA_KEY, SERVICE_ROLE |
| Webhook verifica token | GET handler vs WHATSAPP_WEBHOOK_SECRET |
| Opt-out respetado + service client | createServiceClient() bypasses RLS para wa_opt_outs |

---

### 3. SMOKE TEST

**Archivos**:
- Bash: `scripts/smoke-test.sh`
- PowerShell: `scripts/smoke-test.ps1`

**Uso**:
```bash
# Linux/Mac/Git Bash
./scripts/smoke-test.sh https://tu-url.vercel.app

# Windows PowerShell
.\scripts\smoke-test.ps1 -BaseUrl https://tu-url.vercel.app
```

**Cobertura actual**: 12 checks automatizados en < 30s

| Check | Endpoint | Esperado |
|-------|----------|----------|
| 1 | GET / | 200 |
| 2 | GET /contacto | 200 |
| 3 | GET /login | 200 |
| 4 | GET /admin (sin sesion) | 307 |
| 5 | POST /api/contact-leads (valido) | 201 |
| 6 | POST /api/contact-leads (invalido) | 400 |
| 7 | GET /api/courses | 200 |
| 8 | POST /api/enrollments (sin auth) | 401 |
| 9 | POST /api/whatsapp (sin auth) | 401 |
| 10 | GET /api/whatsapp/webhook (token incorrecto) | 403 |
| 11 | POST /api/whatsapp/webhook (opt-out SALIR) | 200 |
| 12 | POST /api/whatsapp/webhook (mensaje generico) | 200 |

> Deteccion automatica de 401 Deployment Protection (exit code 2).

**Nota importante**: smoke test para POST /api/whatsapp ahora espera **401** (sin auth), no 400. Requiere actualizar ambos scripts.

---

### 4. ROLLBACK — 5 niveles

| Nivel | Accion | Tiempo |
|-------|--------|--------|
| 1 | Vercel > Deployments > anterior > Promote to Production | < 1 min |
| 2 | Vercel > Env Vars > corregir > Redeploy | < 5 min |
| 3 | git revert HEAD && git push | < 10 min |
| 4 | Borrar env var especifica (HUBSPOT/WA) > Redeploy | < 5 min |
| 5 | Nuclear: desconectar dominio o pausar proyecto | < 2 min |

---

### 5. MENSAJE CLIENTE

Ver `DELIVERY-QA-STAGING.md` (raiz del proyecto). Incluye: formulario leads, login, sync HubSpot, auto-reply WhatsApp, opt-out compliance, pipeline CRM, RevOps, URL preview real.

---

## Changelog

### [T-1] 2026-04-20
- Auditoria codigo. DELIVERY-QA-STAGING.md v1 (19 tests, 4 env vars).

### [T-2] 2026-04-20
- Reauditoria post-Cursor Principal. v2 (44 tests, 7 env vars). smoke-test.sh creado.

### [T-3] 2026-04-20
- Reauditoria post-Terminal B y C. TERMINAL-D-DELIVERY.md creado como doc vivo.
- QA: 51 tests. smoke-test.sh: 12 checks.

### [T-4] 2026-04-20 (Cursor Principal)
- smoke-test.ps1 creado. Ejecucion confirmo 401 Deployment Protection.

### [T-5] 2026-04-20
- Auditoria de integridad: verificado que todos los archivos referenciados existen.
- Build corregido: 11 -> 13 rutas (auth/callback + whatsapp protegido).
- FIX QA: POST /api/whatsapp ahora requiere auth admin (Terminal C T-2). Tests #7-#10 reescritos: sin auth=401, sin rol=403, admin+valido=200, admin+invalido=400.
- QA total: 53 tests (antes 51: +2 por split de /api/whatsapp auth).
- Seguridad: +1 check (POST /api/whatsapp auth admin).
- Smoke tests: actualizado check #9 de 400 a 401 (sin auth). PS1 sincronizado con webhook tests.
- DELIVERY-QA-STAGING.md confirmado en raiz del proyecto, referencia corregida.
