# Protocolo paralelo NeoSer (Cursor + Claude)

Documento para ejecutar en paralelo sin cruzar cambios.

## 1) Contexto base que TODOS deben recibir

Copiar este bloque al inicio de cada chat/terminal:

```txt
Proyecto: NeoSer
Stack fijo: Next.js + Supabase + Vercel
No re-arquitecturar.
Objetivo inmediato: MVP técnico operativo hoy.
Prioridad P0:
- Auth básico
- APIs mínimas: contact-leads, courses, enrollments
- RLS mínima segura
- Ruta admin protegida
- Google Maps con fallback
- Staging deploy checklist + env vars
Reglas:
- Trabajar solo en el scope asignado
- No tocar archivos fuera del scope
- Si hay bloqueo, proponer workaround inmediato
- Reportar: Decisión / Cambios / Verificación / Bloqueos
```

## 2) Regla de oro para no cruzarse

- 1 terminal = 1 scope = 1 rama.
- Nadie modifica archivos de otro scope.
- Si un cambio afecta scope ajeno, dejar TODO en markdown y no editar.
- Commits pequeños y frecuentes.

## 3) Mapa de terminales y scopes

## Terminal 1 (Cursor principal) - Integración y cierre

- **Rama**: `feat/integracion-final-mvp`
- **Scope**:
  - Integrar piezas de todas las ramas.
  - Resolver conflictos.
  - Ejecutar `lint`, `build`, smoke checks.
  - Preparar salida final para cliente.
- **Archivos permitidos**:
  - `neoser-app/src/app/*` (integración)
  - `neoser-app/docs/*`
  - `neoser-app/README.md`

## Terminal 2 (Claude A) - Auth + Admin mínimo

- **Rama**: `feat/auth-admin-v1`
- **Scope**:
  - Login, registro, recuperación.
  - Protección de rutas y guardas de sesión.
  - Vista admin mínima usable.
- **Archivos permitidos**:
  - `neoser-app/src/app/(auth)/*` o `neoser-app/src/app/auth/*`
  - `neoser-app/src/app/admin/*`
  - `neoser-app/src/lib/supabase/*`
  - `neoser-app/src/proxy.ts`

## Terminal 3 (Claude B) - APIs + validaciones + RLS

- **Rama**: `feat/api-rls-v1`
- **Scope**:
  - Endpoints `contact-leads`, `courses`, `enrollments`.
  - Validaciones Zod.
  - Ajustes RLS y schema SQL.
- **Archivos permitidos**:
  - `neoser-app/src/app/api/*`
  - `neoser-app/src/lib/schemas.ts`
  - `neoser-app/supabase/schema.sql`

## Terminal 4 (Claude C) - UI pública + contacto + Maps

- **Rama**: `feat/public-ui-maps-v1`
- **Scope**:
  - Home pública y secciones.
  - Form de contacto conectado a API.
  - Integración Google Maps con fallback.
- **Archivos permitidos**:
  - `neoser-app/src/app/page.tsx`
  - `neoser-app/src/app/contacto/*`
  - `neoser-app/src/components/google-map-embed.tsx`
  - `neoser-app/src/app/globals.css`

## Terminal 5 (Claude D) - Deploy + QA + operación

- **Rama**: `feat/deploy-qa-runbook`
- **Scope**:
  - Variables por entorno.
  - Checklist staging/go-live/rollback.
  - Guía operativa para Diana.
- **Archivos permitidos**:
  - `neoser-app/.env.example`
  - `neoser-app/docs/staging-cutover-checklist.md`
  - `neoser-app/docs/migration-baseline.md`
  - `neoser-app/README.md`

## 4) Convención de ramas y commits

- Crear rama desde `main`:
  - `git checkout main`
  - `git pull`
  - `git checkout -b feat/<scope>`
- Convención de commit:
  - `feat(auth): add login and reset flow`
  - `feat(api): add contact leads validation`
  - `docs(deploy): add staging rollback checklist`

## 5) Protocolo de handoff por terminal

Cada terminal debe entregar SIEMPRE:

```txt
DECISION:
CAMBIOS HECHOS:
ARCHIVOS TOCADOS:
VERIFICACION (lint/build/test):
BLOQUEOS:
SIGUIENTE PASO SUGERIDO:
```

## 6) Integración sin conflictos (orden recomendado)

1. Merge Terminal 3 (API/RLS).
2. Merge Terminal 2 (Auth/Admin).
3. Merge Terminal 4 (UI/Maps).
4. Merge Terminal 5 (docs/deploy).
5. Integración final en Terminal 1.

Si hay conflictos:
- Mantener verdad de backend en `schema.sql` y `src/app/api/*`.
- Mantener verdad de UI en `src/app/page.tsx` y `src/components/*`.
- Re-ejecutar `npm run lint` y `npm run build`.

## 7) Checklist rápido anti-cruce (antes de commitear)

- Estoy en la rama correcta.
- Solo toqué archivos de mi scope.
- Corrí lint/build o pruebas mínimas.
- Dejo handoff estructurado.

## 8) Comandos mínimos útiles

```bash
npm run lint
npm run build
```

```bash
git status
git add .
git commit -m "feat(scope): short message"
```

## 9) Criterio de cierre de hoy

- MVP funcional en staging.
- Auth base activo.
- APIs mínimas operativas.
- RLS mínima aplicada.
- Contacto + Maps con fallback.
- Documentación de despliegue y rollback lista.
