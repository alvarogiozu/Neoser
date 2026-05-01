# Documentación NeoSer

Toda la documentación del proyecto vive aquí. El orden numérico de las carpetas es el orden recomendado de lectura para onboarding.

## Índice

| Carpeta | Qué contiene | Para qué se usa |
|---|---|---|
| [`00-contexto/`](00-contexto/) | Definición del proyecto, scope congelado, accesos, handoffs, brief original | **Empezar acá**. Antes de codear cualquier cosa. |
| [`01-contratos/`](01-contratos/) | Contrato vigente de soporte técnico + contrato de desarrollo (fase 1) | Saber qué estamos obligados a entregar y mantener |
| [`02-comercial/`](02-comercial/) | Cotización, factura, checklists del cliente, revisión web | Trazabilidad comercial del proyecto |
| [`03-playbooks-revops/`](03-playbooks-revops/) | Playbooks RevOps: nurturing, SLA, reactivación, referidos, dashboards, email stack | Diseñar/auditar flujos de CRM, email, automatizaciones |
| [`05-entrega-y-qa/`](05-entrega-y-qa/) | Delivery, QA, staging, rollback + coordinación backend/delivery | Subir cambios, validar entregables, gestionar incidencias |
| [`06-coordinacion-equipo/`](06-coordinacion-equipo/) | Protocolo multi-agente (Cursor + varios Claudes), sync entre sesiones | Cuando trabaja más de una IA o persona en paralelo |
| [`_archivo/`](_archivo/) | Archivos históricos preservados por trazabilidad (no usar para trabajo activo) | Solo referencia histórica |

## Convención

- Carpetas y archivos `.md` en **kebab-case**.
- Mayúsculas reservadas para nombres con convención del repo (`README.md`, `TERMINAL-X-*.md`).
- Cuando un documento es **canónico** y existe una copia operativa más cerca del código (ej. `neoser-app/docs/operaciones/`), la copia operativa lleva en su cabecera un enlace al canónico.

## Fuentes únicas de verdad

| Tema | Canónico |
|---|---|
| Scope y decisiones de producto | `00-contexto/00-definicion-proyecto.md` + `00-contexto/01-scope-freeze-v1.md` |
| Obligaciones contractuales con la clienta | `01-contratos/vigente-soporte-tecnico-2026.pdf` |
| Delivery / QA / Staging | `05-entrega-y-qa/delivery-qa-staging.md` |
| Stack de email | `03-playbooks-revops/07-email-stack-inicial.md` |
