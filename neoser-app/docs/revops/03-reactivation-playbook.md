# NeoSer — Playbook de Reactivación de Leads "Perdidas"

## Por qué en maternidad "Perdida" no es "muerta"

En un negocio normal, un lead perdido probablemente no vuelve. En maternidad es diferente:
- La que dijo NO al curso prenatal en semana 16... quizás dice SI en semana 30 cuando siente urgencia
- La que no pagó el curso prenatal... necesitará el postnatal en 4 meses
- La que solo preguntó por curiosidad... quizás tiene una amiga embarazada en 2 meses

**Cada lead "perdida" es un lead futuro o una referidora potencial.**

## Sistema de reactivación (3 niveles)

### Nivel 1: Reactivación automática suave (día 14 — ya configurado)
- Trigger: Deal movido a "Perdida"
- Acción: Email "te extrañamos" con contenido gratuito (no venta)
- Ejemplo: "Hola [nombre], independiente de si tomamos el curso juntas, quiero compartirte esta guía gratuita de [tema relevante]"

### Nivel 2: Reactivación por evento (manual, Diana)
Cuando hay un nuevo curso o evento:
1. Diana abre vista "Perdidas últimos 90 días" en HubSpot
2. Filtra por `servicio_interes` relevante
3. Envía WA personalizado: "Hola [nombre], te acuerdas que preguntaste por [servicio]? Abrimos nuevo grupo el [fecha], te interesa?"

### Nivel 3: Reactivación por ciclo de vida (automática)
Basada en `fecha_parto`:
- Si lead perdida tiene `fecha_parto` en los próximos 30 días:
  - Tarea Diana: "Recontactar a [nombre], está por dar a luz"
- Si lead perdida tiene `fecha_parto` que ya pasó hace 14 días:
  - Email automático: oferta curso postnatal

## Reglas de reactivación

1. **Máximo 3 intentos de reactivación** por lead en 6 meses
2. **Nunca reactivar** si el lead pidió explícitamente no ser contactada (marcar campo `do_not_contact` en HubSpot)
3. **Siempre liderar con valor** (contenido gratuito), nunca con venta directa
4. **Respetar wa_consent**: si no dio consentimiento WA, solo email

## Implementación

### Campo adicional sugerido en HubSpot:
- `reactivation_count` (Number): cuántas veces se ha intentado reactivar. Máximo 3.
- `do_not_contact` (Checkbox): si pidió no ser contactada.

### Vista en HubSpot:
- "Reactivables": etapa = Perdida AND reactivation_count < 3 AND do_not_contact = false
