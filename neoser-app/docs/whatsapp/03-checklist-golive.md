# Checklist Go-live WhatsApp (360dialog)

## 1) Configuración base
- [ ] Configurar `WHATSAPP_API_KEY` en Vercel.
- [ ] Configurar `WHATSAPP_WEBHOOK_SECRET` en Vercel.
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY` en Vercel (opt-outs).
- [ ] Registrar webhook URL en 360dialog:
  - `GET/POST https://<tu-dominio>/api/whatsapp/webhook`

## 2) Registrar plantillas en Meta
- [ ] `neoser_bienvenida`
- [ ] `neoser_seguimiento`
- [ ] `neoser_recordatorio`
- [ ] `neoser_reactivacion`
- [ ] `neoser_confirmacion_pago`

## 3) Verificación técnica
- [ ] GET webhook token incorrecto devuelve 403.
- [ ] GET webhook token correcto devuelve challenge (200).
- [ ] POST webhook con mensaje normal devuelve 200.
- [ ] POST webhook con `SALIR` registra opt-out.

## 4) Curl de referencia
```bash
curl -i "https://<tu-dominio>/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=123"
```

```bash
curl -i -X POST "https://<tu-dominio>/api/whatsapp/webhook" \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000001","text":{"body":"SALIR"}}]}}]}]}'
```

## 5) Validación funcional
- [ ] `POST /api/contact-leads` con `waConsent=true` dispara bienvenida (si API key activa).
- [ ] `POST /api/contact-leads` con `waConsent=false` no envía mensaje.
- [ ] Contactos en opt-out no reciben respuestas automáticas.
