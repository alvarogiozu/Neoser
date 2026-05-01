# NeoSer — Adapter de proveedor WhatsApp

## Objetivo

Evitar dependencia rigida de un solo BSP. La capa de envio permite cambiar de `360dialog` a `whato` sin reescribir endpoints del negocio.

## Configuracion

- `WHATSAPP_PROVIDER=360dialog` (default)
- `WHATSAPP_API_KEY=<token proveedor>`
- `WHATSAPP_WHATO_ENDPOINT=<url webhook/api whato>` (solo si provider = whato)

## Comportamiento

- `sendWhatsappTemplate()` y `sendWhatsappText()` enrutan al proveedor definido.
- Endpoints de negocio (`/api/whatsapp`, `/api/whatsapp/webhook`) no cambian.
- Se mantiene politica anti-baneo/opt-out desde backend de NeoSer.

## Regla operativa

- En V1 se recomienda `360dialog`.
- `whato` se activa luego cambiando solo env vars y pruebas de smoke.

