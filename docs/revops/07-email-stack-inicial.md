# NeoSer — Email stack inicial (V1)

## Decisiones de V1

- Se habilita capa de email automation en backend con provider configurable.
- `EMAIL_PROVIDER=hubspot` (default operativo) o `EMAIL_PROVIDER=brevo`.
- Auditoria de envios en tabla `email_events`.

## Endpoint operativo

- `POST /api/email/automation`

Payload:

```json
{
  "to": "mama@correo.com",
  "templateKey": "confirmacion_reserva",
  "leadId": "uuid-opcional",
  "bookingId": "uuid-opcional",
  "variables": {
    "fullName": "Maria"
  }
}
```

## Plantillas base V1

- `bienvenida_lead`
- `confirmacion_reserva`
- `seguimiento_general`

## Checklist de activacion

- [ ] Definir remitente (`EMAIL_FROM`).
- [ ] Definir proveedor (`EMAIL_PROVIDER`).
- [ ] Configurar key (`EMAIL_API_KEY`) si provider = `brevo`.
- [ ] Validar SPF/DKIM/DMARC en dominio.
- [ ] Ejecutar 3 envios de prueba y revisar `email_events`.

