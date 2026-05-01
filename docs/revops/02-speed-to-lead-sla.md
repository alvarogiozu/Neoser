# NeoSer — Speed-to-Lead & SLAs por Fuente

## Por qué esto importa

Dato duro: un lead contactado en los primeros 5 minutos tiene **21x más probabilidad** de convertir que uno contactado a los 30 minutos. Con ads pagados, cada minuto de retraso es dinero quemado.

## SLAs por fuente de origen

| Fuente | SLA respuesta | Tipo respuesta | Prioridad |
|--------|--------------|----------------|-----------|
| Meta Ads (formulario) | < 5 min | Auto: email + tarea inmediata Diana | CRÍTICA |
| Google Ads | < 5 min | Auto: email + tarea inmediata Diana | CRÍTICA |
| Web form | < 15 min | Auto: email inmediato, tarea Diana en 15 min | ALTA |
| Instagram orgánico (DM) | < 2 horas | Tarea Diana | MEDIA |
| WhatsApp directo | < 1 hora | Tarea Diana (ya está en WA) | MEDIA |
| Referida | < 4 horas | Tarea Diana | NORMAL |

## Cómo implementar con HubSpot Free

### Para fuentes automáticas (Ads + Web form):
1. Formulario de HubSpot o integración API captura el lead
2. Workflow 1 (ya configurado): email bienvenida inmediato + tarea a Diana
3. Diana recibe notificación push en app HubSpot

### Para fuentes manuales (IG, WA, referida):
1. Diana registra el contacto manualmente en HubSpot app (30 seg)
2. El pipeline lo trackea automáticamente desde ahí

## Alerta de SLA roto

Configurar en HubSpot:
- Vista guardada: "Leads sin contactar > 1 hora"
- Filtro: `fecha_creacion > hace 1 hora` AND `etapa = Lead Nueva`
- Diana la abre si le sobra un minuto en su rutina diaria

## Métricas a trackear (semanal)

| Métrica | Meta inicial | Cómo medir |
|---------|-------------|------------|
| Tiempo promedio primera respuesta | < 30 min | HubSpot report: tiempo entre creación y primera actividad |
| % leads contactados en < 1h | > 80% | Vista filtrada |
| % leads que avanzan de "Lead Nueva" a "Contactada" | > 70% | Pipeline report |
| Tasa de conversión "Contactada" → "Inscrita" | > 15% | Pipeline report |
