# Contratos

Esta carpeta concentra los acuerdos legales del proyecto NeoSer. Importa para que las decisiones técnicas (alcance, plazos, propiedad intelectual, soporte) estén alineadas con lo firmado.

## Contratos vigentes

| Archivo | Tipo | Vigencia | Uso |
|---|---|---|---|
| [`vigente-soporte-tecnico-2026.pdf`](vigente-soporte-tecnico-2026.pdf) | Soporte técnico y mantenimiento post-entrega | 12 meses desde firma (20-abr-2026) | **Define qué incluye y qué NO incluye el soporte** que Álvaro presta a Diana / NeoSer S.A.C. de forma independiente |
| `vigente-soporte-tecnico-2026.tex` | Fuente LaTeX del PDF anterior | — | Para regenerar el PDF si se actualizan cláusulas |
| [`desarrollo-web-fase1.pdf`](desarrollo-web-fase1.pdf) | Locación de servicios para el desarrollo del sitio (fase 1) | Fase 1 (entrega del sitio) | Define el alcance del desarrollo inicial: landing, captación de leads, integración WhatsApp/HubSpot/Supabase |

## Cómo se conecta con el código

- **`vigente-soporte-tecnico-2026.pdf`** → fija los SLA reflejados en `docs/05-entrega-y-qa/delivery-qa-staging.md` (48h respuesta inicial, 24h incidencias críticas, 72h consultas, 2 semanas correcciones).
- **`desarrollo-web-fase1.pdf`** → fija el alcance reflejado en `docs/00-contexto/01-scope-freeze-v1.md`. Cualquier feature fuera de ese alcance es Change Request.

## Histórico

`_historico/` queda reservada para acuerdos previos que ya no rigen el trabajo actual (por ejemplo, contratos de etapas anteriores con otros equipos). Si aparecen, mover allí con un README breve explicando por qué dejaron de aplicar.
