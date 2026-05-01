# Contexto del proyecto NeoSer

Lee estos documentos en orden al iniciar cualquier sesión de trabajo:

1. @docs/00-contexto/00-definicion-proyecto.md — scope, usuarios, plataforma, datos, login, pagos
2. @docs/00-contexto/01-scope-freeze-v1.md — alcance congelado V1 (no expandir sin Change Request)

## Mapa rápido del repositorio

- `website/` — sitio HTML estático en producción
- `neoser-app/` — app Next.js + Supabase (trabajo principal V1)
- `branding/` — identidad visual (logos, fuentes, plantillas)
- `docs/` — documentación viva del proyecto

## Reglas no negociables

- No expandir scope V1: cualquier feature nueva fuera del alcance congelado va por Change Request.
- No exponer datos personales de salud (leads de gestantes) en logs o servicios externos sin consentimiento.
- No tocar formularios en producción sin verificar — hay ads de Meta y Google corriendo.
- Idioma de docs y UI: español (Perú).

## Para tareas de desarrollo

- Operativa de la app: `neoser-app/README.md` y `neoser-app/AGENTS.md`.
- QA/Staging/Rollback: `docs/05-entrega-y-qa/delivery-qa-staging.md`.
- Coordinación si hay múltiples agentes en paralelo: `docs/06-coordinacion-equipo/sync-claudes-neoser.md`.
