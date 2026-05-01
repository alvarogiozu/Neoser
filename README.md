# NeoSer

Sitio web institucional + capa operativa digital para el centro de maternidad y medicina humanizada **NeoSer** (Chiclayo, Perú).

> Este README es el mapa del repo. Si vas a programar, sigue el orden de [Onboarding](#onboarding-rápido).

---

## Estructura del repositorio

```
.
├── website/           Sitio HTML estático (landing actual en producción)
├── neoser-app/        App Next.js + Supabase (V1 backend, reservas, CRM)
├── branding/          Identidad visual: logos, fuentes, plantillas, manual de marca
└── docs/              Toda la documentación del proyecto (ver índice abajo)
```

| Carpeta | Para qué sirve | Cuándo entrar |
|---|---|---|
| `website/` | Landing estática heredada (HTML/CSS/JS plano) | Cambios menores de copy mientras se migra a `neoser-app/` |
| `neoser-app/` | App Next.js: APIs, auth, integraciones (Supabase, Cal.com, HubSpot, WhatsApp 360dialog) | **Trabajo principal de desarrollo V1** |
| `branding/` | Manual de marca + assets para web/RRSS | Cuando necesites un logo, fuente o color |
| `docs/` | Contexto, contratos, playbooks RevOps/WhatsApp, entregables, coordinación | Antes de codear cualquier feature |

---

## Onboarding rápido

Lectura mínima en orden, antes de tocar código:

1. [`docs/00-contexto/00-definicion-proyecto.md`](docs/00-contexto/00-definicion-proyecto.md) — qué es NeoSer, usuarios, alcance V1 vs V2.
2. [`docs/00-contexto/01-scope-freeze-v1.md`](docs/00-contexto/01-scope-freeze-v1.md) — alcance congelado de V1 (no expandir sin Change Request).
3. [`docs/01-contratos/vigente-soporte-tecnico-2026.pdf`](docs/01-contratos/vigente-soporte-tecnico-2026.pdf) — contrato vigente (lo que estamos obligados a entregar y mantener).
4. [`neoser-app/README.md`](neoser-app/README.md) — cómo levantar la app local.
5. [`docs/05-entrega-y-qa/delivery-qa-staging.md`](docs/05-entrega-y-qa/delivery-qa-staging.md) — checklist de QA, staging, rollback.

Lectura adicional según tu rol:

- **Backend / integraciones** → `docs/05-entrega-y-qa/TERMINAL-C-BACKEND.md` + `neoser-app/docs/backend/`
- **RevOps / CRM / Email** → `docs/03-playbooks-revops/`
- **WhatsApp / 360dialog** → `docs/04-playbooks-whatsapp/`
- **UI / Frontend** → `docs/00-contexto/04-ui-handoff-hermano.md`
- **Multi-agente (varios Claudes/Cursor en paralelo)** → `docs/06-coordinacion-equipo/`

---

## Stack y restricciones

- **Stack fijo**: Next.js + Supabase + Vercel (no re-arquitecturar).
- **Idioma**: español (Perú). **Zona horaria**: America/Lima (UTC-5).
- **Datos sensibles**: leads contienen datos de salud — no exponer en logs ni compartir sin consentimiento.
- **Ads activos** (Meta + Google) → los formularios no pueden romperse en producción.
- **Diana opera sola, perfil técnico bajo** → simplicidad sobre features.

---

## Comandos rápidos

```bash
# Levantar la app Next.js
cd neoser-app
npm install
npm run dev

# Smoke test contra preview
./neoser-app/scripts/smoke-test.sh https://<preview-url>
```

---

## Para agentes IA (Claude, Cursor, Codex)

- `CLAUDE.md` (raíz) y `AGENTS.md` (raíz) cargan el contexto mínimo automáticamente.
- `neoser-app/AGENTS.md` advierte sobre la versión actual de Next.js (no asumir conocimiento entrenado).
- Si trabajan varios agentes en paralelo, coordinen vía `docs/06-coordinacion-equipo/sync-claudes-neoser.md`.
