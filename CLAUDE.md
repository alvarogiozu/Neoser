# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Contexto del proyecto NeoSer

Lee estos documentos en orden al iniciar cualquier sesión de trabajo:

1. @docs/00-contexto/00-definicion-proyecto.md — scope, usuarios, plataforma, datos, login, pagos
2. @docs/00-contexto/01-scope-freeze-v1.md — alcance congelado V1 (no expandir sin Change Request)

## Mapa rápido del repositorio

- `website/` — sitio HTML estático en producción (legado, en migración)
- `neoser-app/` — app Next.js + Supabase (trabajo principal V1)
- `branding/` — identidad visual (logos, fuentes, plantillas)
- `docs/` — documentación viva del proyecto

## Reglas no negociables

- No expandir scope V1: cualquier feature nueva fuera del alcance congelado va por Change Request.
- No exponer datos personales de salud (leads de gestantes) en logs o servicios externos sin consentimiento.
- No tocar formularios en producción sin verificar — hay ads de Meta y Google corriendo.
- Idioma de docs y UI: español (Perú).
- **Next.js 16.x** está en uso (Turbopack por defecto). Si tu conocimiento es de versiones anteriores, consulta `neoser-app/node_modules/next/dist/docs/` antes de codear — APIs y convenciones cambiaron (ver `neoser-app/AGENTS.md`).

---

## Comandos comunes (todos desde `neoser-app/`)

```bash
npm install          # instalar dependencias
npm run dev          # arrancar dev server en http://localhost:3000 (Turbopack)
npm run build        # build de producción
npm run start        # servir build de producción
npm run lint         # ESLint
```

No hay test runner configurado en V1. La validación es manual + smoke test (ver más abajo).

### Smoke test contra preview

```bash
./neoser-app/scripts/smoke-test.sh https://<preview-url>
```

### Aplicar / actualizar esquema de Supabase

1. Abrir Supabase dashboard → **SQL Editor** → **New query**
2. Pegar el contenido de `neoser-app/supabase/schema.sql` y ejecutar
3. Si hay fix de políticas/RLS, usar archivos `neoser-app/supabase/fix-*.sql` (idempotentes, seguros de re-ejecutar)

---

## Arquitectura de `neoser-app/`

App Next.js 16 con **App Router** (`src/app/`). Cada subcarpeta de `app/` es una ruta; las páginas son `page.tsx` y los endpoints viven en `app/api/<recurso>/route.ts`.

### Capas y responsabilidades

| Capa | Ubicación | Rol |
|---|---|---|
| Páginas / UI | `src/app/*/page.tsx` | Server + Client Components (rutas de la web) |
| Componentes reutilizables | `src/components/` | Forms (`contact-lead-form`, `booking-preform`), `google-map-embed` |
| API routes | `src/app/api/<recurso>/route.ts` | Validan con Zod, escriben a Supabase, sincronizan con servicios externos |
| Validación | `src/lib/schemas.ts` | **Todas** las formas se validan contra schemas Zod aquí |
| Integraciones externas | `src/lib/{cal,email,hubspot,whatsapp}.ts`, `src/lib/payments/` | Encapsulan llamadas a APIs de terceros |
| Clientes Supabase | `src/lib/supabase/{client,server,service,middleware}.ts` | Tres tipos según contexto (ver abajo) |

### Patrón de Supabase: tres clientes según contexto

- `lib/supabase/client.ts` — usa **anon key** desde el navegador (browser/Client Components)
- `lib/supabase/server.ts` — usa **anon key** desde el servidor con cookies para SSR auth (Server Components, route handlers públicos)
- `lib/supabase/service.ts` — usa **service_role key**, **bypasea RLS**. Usar **solo** en webhooks o tareas administrativas server-side donde RLS no aplica (ej: `bookings/cal-webhook`)

Nunca mezcles: si el endpoint es público y debe respetar RLS → `server.ts`. Si es un webhook server-to-server con secreto verificado → `service.ts`.

### Patrón de las API routes

Casi todas siguen este flujo:

1. `parsed = schema.safeParse(payload)` → si falla, devolver 400 con `error: "Datos invalidos"`
2. Operación principal en Supabase (insert/update/select) → si falla, devolver 500
3. Sincronización con servicios externos (HubSpot, WhatsApp, email) **dentro de `try/catch` separado y no-bloqueante** — si falla, se loguea pero la operación principal igual responde 201
4. Devolver `{ ok: true, ...id }` con código apropiado

Ejemplo canónico: `src/app/api/contact-leads/route.ts`. Replicar el patrón al agregar nuevas rutas.

### Endpoints actuales

- `GET /api/courses` — catálogo público (filtra `is_published=true`)
- `POST /api/contact-leads` — captura de leads desde formularios web
- `GET /api/contact-leads` — lista de leads (admin only, con filtros `status`/`source`)
- `PATCH /api/contact-leads/[id]` — actualizar lead (admin)
- `GET/POST /api/bookings` — reservas manuales
- `POST /api/bookings/cal-webhook` — recibe eventos Cal.com (verifica firma)
- `POST /api/enrollments` — matrícula (requiere sesión autenticada)
- `POST /api/lead-notes` — notas CRM (admin)
- `POST /api/email/automation` — disparar plantillas (admin)
- `POST /api/payments/create` + `POST /api/payments/webhook` — Mercado Pago
- `GET/POST /api/whatsapp` + `/api/whatsapp/webhook`

### Esquema Supabase y RLS

- Esquema fuente: `neoser-app/supabase/schema.sql` (idempotente con `if not exists`)
- **Patrón de RLS**: tablas de admin usan la función `public.is_admin()` (`SECURITY DEFINER`, bypasea RLS) para evitar recursión. **Nunca consultes `public.profiles` directamente dentro de una policy** — usa `is_admin()`.
- Tablas con políticas públicas de inserción (`anon, authenticated`): `contact_leads`, `bookings`. Lectura pública: `courses` (solo `is_published=true`).
- Si necesitas debugear políticas: `neoser-app/supabase/diagnostico-politicas.sql` lista las policies actuales.

---

## Convenciones específicas

- **Fuentes**: cargadas vía `next/font/local` desde `public/fonts/` con CSS variables (`--font-montserrat`, `--font-playfair`, `--font-dancing`). Editarlas en `src/app/layout.tsx`.
- **Estilos**: Tailwind CSS v4 (sin `tailwind.config.ts`). Variables y clases custom en `src/app/globals.css` bajo `@layer components`.
- **Validación**: nunca aceptar input sin pasar por un schema Zod de `src/lib/schemas.ts`. Si necesitas un schema nuevo, crearlo ahí.
- **Imágenes**: en `public/assets/` (logos) y `public/fonts/`. Usar `next/image` para nuevas imágenes.
- **No instalar paquetes nuevos** sin alinear con scope V1.

---

## Para tareas de desarrollo

- Operativa de la app: `neoser-app/README.md` y `neoser-app/AGENTS.md`.
- QA/Staging/Rollback: `docs/05-entrega-y-qa/delivery-qa-staging.md`.
- Coordinación si hay múltiples agentes en paralelo: `docs/06-coordinacion-equipo/sync-claudes-neoser.md`.

## Variables de entorno

`.env.local` no se sube a git. Copiar de `neoser-app/.env.example` y rellenar. Variables clave: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_CAL_BOOKING_URL`, `HUBSPOT_ACCESS_TOKEN`, `EMAIL_PROVIDER` (+ `EMAIL_API_KEY`), `WHATSAPP_PROVIDER` (+ `WHATSAPP_API_KEY`), `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Lista completa en `neoser-app/README.md`.
