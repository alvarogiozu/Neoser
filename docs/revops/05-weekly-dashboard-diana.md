# NeoSer — Dashboard Semanal de Diana (5 min cada lunes)

## Concepto

Diana no necesita analytics complejos. Necesita 5 números cada lunes para saber si la semana pasada fue buena y qué ajustar esta semana.

## Los 5 números que Diana ve cada lunes

### 1. Leads nuevos esta semana
- **Dónde verlo**: HubSpot → Contacts → Vista "Creados esta semana"
- **Meta inicial**: >10/semana (con ads corriendo)
- **Si está bajo**: revisar si ads están corriendo, si el form funciona
- **Si está alto**: celebrar y asegurar que el SLA de respuesta se mantiene

### 2. Tasa de contacto (% que pasó de "Lead Nueva" a "Contactada")
- **Dónde verlo**: HubSpot → Deals → Pipeline report
- **Meta**: >80%
- **Si está bajo**: Diana no está respondiendo a tiempo. Revisar tareas pendientes.

### 3. Tasa de conversión (% que llegó a "Inscrita")
- **Dónde verlo**: HubSpot → Deals → Pipeline report
- **Meta mes 1**: >10% (de lead nueva a inscrita)
- **Meta mes 3**: >15%
- **Si está bajo**: el problema está en la propuesta, el precio, o el timing

### 4. Fuente que más convierte
- **Dónde verlo**: HubSpot → Reports → Contacts by fuente_origen
- **Para qué**: saber dónde invertir más en ads y dónde recortar
- **Acción**: si Meta Ads convierte 3x más que Google → mover presupuesto

### 5. Leads "calientes" esta semana (próximas a parir + interesadas)
- **Dónde verlo**: Vista "Próximas a parir (4 semanas)" + Vista "Interesadas"
- **Acción**: estas son prioridad absoluta de contacto esta semana

## Rutina del lunes (5 min)

```
□ Abrir HubSpot en laptop (no celular, pantalla grande)    — 30 seg
□ Mirar dashboard: ¿cuántos leads entraron esta semana?    — 30 seg
□ Revisar pipeline: ¿cuántos avanzaron? ¿cuántos se perdieron? — 1 min
□ Revisar fuente de origen: ¿de dónde vienen los buenos?   — 1 min
□ Identificar las 3-5 leads más calientes de la semana      — 1 min
□ Planificar: ¿a quién contacto primero hoy?                — 1 min
```

## Configurar en HubSpot (una sola vez)

### Vistas guardadas necesarias:
1. "Creados esta semana" — filtro: create_date = esta semana
2. "Próximas a parir (4 semanas)" — filtro: fecha_parto entre hoy y +28 días
3. "Interesadas sin propuesta" — filtro: etapa = Interesada, última actividad > 3 días
4. "Perdidas reactivables" — filtro: etapa = Perdida, reactivation_count < 3

### Report (crear 1 vez):
1. "Pipeline semanal" — tipo: Deal pipeline report, periodo = última semana
2. "Leads por fuente" — tipo: Contact report agrupado por fuente_origen

## Evolución mes 2+

Cuando haya datos suficientes (>50 leads), agregar:
- Costo por lead por fuente (requiere datos de ads)
- Tiempo promedio de ciclo (días desde Lead Nueva hasta Inscrita)
- Revenue por fuente (qué canal trae leads que pagan más)
