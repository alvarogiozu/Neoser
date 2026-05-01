# Politica Anti-Baneo WhatsApp - NeoSer

> Documento operativo. Diana y equipo deben leer antes de usar WhatsApp Business.

---

## 10 Reglas (violar cualquiera = riesgo de ban)

### R1: Solo enviar a opt-in explicito
- El usuario DEBE haber marcado el checkbox "Acepto recibir mensajes por WhatsApp" en el formulario web.
- Campo `wa_consent=true` en base de datos es prerequisito.
- Sin consent → no enviar. Sin excepciones.

### R2: Cero listas compradas
- Nunca enviar a numeros que no sean leads propios con consent.
- No importar contactos de grupos de WhatsApp, Excel externos, ni directorios.

### R3: Ventana de 24 horas
- Cuando un cliente te escribe, tienes 24h para responder con texto libre.
- Despues de 24h sin respuesta del cliente → solo plantillas aprobadas.
- El webhook ya maneja esto automaticamente para respuestas iniciales.

### R4: Frecuencia maxima de marketing
- Maximo 1 mensaje de marketing cada 7 dias por usuario.
- Reactivacion: maximo 1 cada 30 dias.
- Recordatorios (UTILITY): sin limite pero usar sentido comun (max 2 por evento).

### R5: Opt-out en CADA mensaje de marketing
- Todas las plantillas MARKETING incluyen "Responde SALIR si no deseas recibir mas mensajes."
- El webhook procesa SALIR automaticamente y registra en tabla `wa_opt_outs`.
- Nunca re-contactar a alguien que dijo SALIR.

### R6: Monitorear Quality Rating
- Revisar diariamente en hub.360dialog.com > Quality.
- VERDE: operacion normal.
- AMARILLO: pausar marketing 48h, solo UTILITY/transaccional.
- ROJO: pausar TODO excepto respuestas a mensajes entrantes.
- FLAGGED: contactar soporte 360dialog de inmediato.

### R7: Escalar volumen gradualmente
- Semana 1: max 50 mensajes/dia.
- Semana 2: max 100 mensajes/dia.
- Semana 3: max 250 mensajes/dia.
- No arrancar con 1000 de golpe. Meta detecta picos y restringe.

### R8: Responder siempre dentro de 24h
- Cada mensaje entrante debe recibir respuesta (el webhook ya da respuesta automatica).
- Diana debe complementar con respuesta personalizada lo antes posible.
- Tasa de respuesta baja = quality score bajo.

### R9: Contenido prohibido
- No urgencia falsa ("ULTIMA OPORTUNIDAD", "SOLO HOY").
- No claims medicos sin disclaimer ("te curamos", "garantizamos").
- NeoSer es salud maternidad: cuidado extra con promesas.
- Permitido: informar, educar, acompanar, invitar.

### R10: Lista de exclusion activa
- Tabla `wa_opt_outs` en Supabase es la fuente de verdad.
- Cuando alguien dice SALIR → se agrega automaticamente.
- Cuando alguien te bloquea → Diana lo agrega manualmente.
- NUNCA re-enviar a numeros en esta lista.

---

## Protocolo de emergencia

```
Quality AMARILLO → Diana para marketing 48h. Solo responder mensajes entrantes.
Quality ROJO    → Parar TODO. Solo responder si el cliente escribe primero.
Quality FLAGGED → Contactar soporte@360dialog.com. No enviar nada.
Ban temporal    → Esperar 7 dias. No crear cuenta nueva (Meta detecta).
```

---

## Checklist diario Diana (2 min)

1. [ ] Revisar Quality Rating en 360dialog dashboard
2. [ ] Revisar si hay mensajes sin responder (mas de 2h)
3. [ ] Verificar que no se envio a nadie de la lista opt-out
4. [ ] Si Quality cambio de verde: seguir protocolo de emergencia

---

## Metricas semanales (lunes)

- Mensajes enviados vs entregados (tasa entrega >95% es sano)
- Cantidad de opt-outs (si sube >5% de envios, revisar contenido)
- Quality Rating historico
- Tiempo promedio de respuesta de Diana
