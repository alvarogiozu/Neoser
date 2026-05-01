# AGENTS.md — guía para agentes IA en NeoSer

Este archivo lo leen automáticamente Cursor, Codex y otras IAs que sigan la convención `AGENTS.md`. Para Claude Code, el equivalente es `CLAUDE.md` (también en raíz).

## Antes de proponer cambios, lee

1. `docs/00-contexto/00-definicion-proyecto.md`
2. `docs/00-contexto/01-scope-freeze-v1.md`
3. `neoser-app/AGENTS.md` (rules específicas de esta versión de Next.js)

## Reglas duras

- **Stack fijo**: Next.js + Supabase + Vercel. No proponer reescritura de arquitectura.
- **Scope congelado V1**: nuevas features fuera del alcance pasan por Change Request, no por código.
- **Datos sensibles**: leads contienen datos de salud (semana de gestación, contacto). Nunca loggear en claro ni mandar a servicios externos sin consentimiento explícito.
- **Producción está viva**: hay ads de Meta y Google enviando tráfico al formulario. Cualquier cambio en el flujo de leads requiere QA en staging.
- **Idioma**: español (Perú) en docs, copy de UI y comentarios cuando aplique.

## Cuándo entrar a cada carpeta

| Si vas a... | Entra a |
|---|---|
| Codear el app Next.js | `neoser-app/src/` |
| Editar landing estática | `website/` |
| Ajustar contratos, scope o decisiones de producto | `docs/00-contexto/` |
| Revisar el contrato vigente con la clienta | `docs/01-contratos/vigente-soporte-tecnico-2026.pdf` |
| Tocar plantillas WhatsApp | `docs/04-playbooks-whatsapp/` |
| Tocar email/CRM/automatizaciones | `docs/03-playbooks-revops/` |
| Subir cambios a staging | `docs/05-entrega-y-qa/delivery-qa-staging.md` |
| Coordinar con otra sesión de IA | `docs/06-coordinacion-equipo/sync-claudes-neoser.md` |

## Commits y PRs

- Mensajes en español, imperativo, prefijo por área (`feat(reservas):`, `fix(whatsapp):`, `docs(contratos):`, `chore(repo):`).
- PRs siguen `.github/pull_request_template.md`.
- No subir `.env*` ni archivos con credenciales.
