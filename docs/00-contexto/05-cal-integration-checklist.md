# NeoSer — Checklist de integracion Cal.com

## Setup de cuenta

- [ ] Crear cuenta de Cal.com de NeoSer.
- [ ] Conectar Google Calendar operativo.
- [ ] Crear event type principal (consulta/reserva).
- [ ] Definir disponibilidad, buffers y zona horaria.

## Configuracion tecnica

- [ ] Configurar `NEXT_PUBLIC_CAL_BOOKING_URL` para frontend.
- [ ] Configurar `CAL_WEBHOOK_SIGNING_KEY` para webhook seguro.
- [ ] Registrar webhook: `POST /api/bookings/cal-webhook`.
- [ ] Confirmar firma valida en eventos entrantes.

## Flujo funcional

- [ ] Formulario pre-reserva guarda en `bookings` (status `pending`).
- [ ] Confirmacion Cal.com actualiza `bookings` por `cal_booking_uid`.
- [ ] Reserva confirmada dispara sync a HubSpot.
- [ ] Reserva confirmada registra evento de email en `email_events`.

## Smoke tests

- [ ] Reserva manual desde formulario web.
- [ ] Reserva real desde calendario Cal.
- [ ] Webhook confirmado en logs.
- [ ] Registro de reserva visible para admin.

