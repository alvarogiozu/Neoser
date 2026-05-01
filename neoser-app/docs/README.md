# Documentación operativa de `neoser-app/`

Esta carpeta contiene **solo docs específicas del app Next.js**: cómo se opera, cómo se sube a staging, cómo se modela algún dato del backend.

Todo lo transversal del proyecto (scope, contratos, playbooks RevOps/WhatsApp, delivery global, coordinación) vive en `../../docs/` (en la raíz del repo).

## Estructura

| Carpeta | Contenido | Cuándo entrar |
|---|---|---|
| [`operaciones/`](operaciones/) | Resumen ejecutivo de delivery/QA, checklist de cutover staging→prod, baseline de migración | Cuando vas a desplegar o validar la app |
| [`backend/`](backend/) | Modelos de datos específicos (ej. booking + email) | Cuando estás tocando schemas o queries en `src/lib/` o `supabase/` |

## Documentación canónica fuera de aquí

| Tema | Vive en | Por qué |
|---|---|---|
| Delivery / QA / Staging completo | `../../docs/05-entrega-y-qa/delivery-qa-staging.md` | Es transversal: aplica al sitio entero, no solo al app |
| Coordinación backend (TERMINAL-C) | `../../docs/05-entrega-y-qa/TERMINAL-C-BACKEND.md` | Coordinación cross-terminal, no operativa local |
| Playbooks RevOps / WhatsApp | `../../docs/03-playbooks-revops/`, `../../docs/04-playbooks-whatsapp/` | Mismas plantillas y políticas para todo el proyecto |
