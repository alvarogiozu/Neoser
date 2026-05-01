# NeoSer — Flujo GitHub y colaboracion

## Estructura de ramas

- `main`: estable, solo codigo listo para produccion.
- `develop`: integracion de cambios de sprint.
- `feature/*`: trabajo por funcionalidad.
- `hotfix/*`: correcciones urgentes en produccion.

## Convencion de ramas

- `feature/ui-reserva-cal`
- `feature/hubspot-sync-v2`
- `feature/supabase-bookings`
- `hotfix/contact-leads-500`

## Convencion de commits

Formato sugerido:

- `feat: integrar webhook de Cal.com`
- `fix: validar expectedDueDate en contact-leads`
- `docs: actualizar matriz de variables`
- `chore: preparar entorno de staging`

## Flujo diario

1. Crear rama desde `develop`.
2. Hacer cambios pequenos y commitear.
3. Abrir PR hacia `develop`.
4. Revisar y aprobar.
5. Merge.
6. Al cierre de release, merge `develop` -> `main`.

## Reglas de colaboracion

- No subir archivos `.env` ni credenciales.
- No mergear a `main` sin QA minimo.
- Adjuntar evidencia de pruebas (capturas/logs) en PRs de integracion.
- Cualquier cambio fuera de alcance V1 se marca como `change-request`.

