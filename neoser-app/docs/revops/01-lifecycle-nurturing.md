# NeoSer — Nurturing por Ciclo de Vida Maternidad

## Concepto

A diferencia de un negocio genérico, NeoSer sabe **exactamente** en qué momento está cada lead (semana de gestación). Esto permite enviar el mensaje correcto en el momento correcto, sin que Diana piense qué decir.

## Matriz de Nurturing Automático

Basado en el campo `semanas_gestacion` + `fecha_parto` en HubSpot.

### Embarazo Temprano (semanas 8-20)
| Semana | Acción automática | Canal | Mensaje clave |
|--------|-------------------|-------|---------------|
| Al registrarse | Email bienvenida + PDF gratuito | Email | "Bienvenida a NeoSer, te acompañamos desde hoy" |
| +3 días | Tarea Diana: WA personal | WhatsApp | "Hola [nombre], ¿cómo te has sentido? ¿Tienes dudas?" |
| +7 días | Email contenido educativo | Email | "5 cosas que nadie te dice del primer trimestre" |
| +14 días | Tarea Diana: ofrecer curso prenatal | WhatsApp | "Tenemos un curso que empieza [fecha], ¿te cuento?" |

### Embarazo Medio (semanas 20-32)
| Semana | Acción automática | Canal | Mensaje clave |
|--------|-------------------|-------|---------------|
| Sem 20 | Email: importancia preparación | Email | "Tu bebé ya siente — así te puedes preparar" |
| Sem 24 | Tarea Diana: ofrecer curso prenatal (urgencia) | WhatsApp | "Quedan [X] cupos para el próximo curso" |
| Sem 28 | Email: contenido periné y movimiento | Email | "Tu cuerpo se prepara — estos ejercicios ayudan" |

### Pre-parto (semanas 32-40)
| Semana | Acción automática | Canal | Mensaje clave |
|--------|-------------------|-------|---------------|
| Sem 32 | Tarea Diana: seguimiento personalizado | WhatsApp | "¿Cómo va todo? Estamos aquí para lo que necesites" |
| Sem 36 | Email: checklist pre-parto | Email | "Tu checklist para las últimas semanas" |
| Sem 38 | Tarea Diana: confirmar plan de parto | WhatsApp | Conversación personal |

### Post-parto (después de fecha_parto)
| Timing | Acción automática | Canal | Mensaje clave |
|--------|-------------------|-------|---------------|
| +7 días | Tarea Diana: felicitar + preguntar | WhatsApp | "¡Felicidades! ¿Cómo están tú y tu bebé?" |
| +14 días | Email: ofrecer curso postnatal | Email | "Recuperación postparto — tu cuerpo también importa" |
| +30 días | Tarea Diana: ofrecer acompañamiento individual | WhatsApp | "¿Te gustaría acompañamiento personalizado?" |
| +60 días | Email: pedir testimonio | Email | "Tu experiencia puede ayudar a otra mamá" |

## Implementación en HubSpot Free

### Opción A: Workflows (limitado a 5 en free)
Usar los 3 workflows operativos ya definidos + 2 workflows de lifecycle:
- Workflow 4: "Nurturing Embarazo" (basado en fecha_parto calculada)
- Workflow 5: "Nurturing Postparto" (trigger: fecha_parto pasó)

### Opción B: Secuencias manuales asistidas
Si los workflows no alcanzan, Diana tiene una vista filtrada en HubSpot:
- Vista "Próximas a parir (4 semanas)" — contactos con fecha_parto en próximos 28 días
- Vista "Recién nacidos (último mes)" — contactos con fecha_parto en últimos 30 días
- Vista "Sin contacto 7+ días" — contactos sin actividad reciente

Diana revisa estas vistas en su rutina diaria y actúa según la matriz.

## Contenido necesario (pendiente de Diana)
- [ ] PDF de bienvenida gratuito
- [ ] 3-4 emails educativos por trimestre
- [ ] Checklist pre-parto
- [ ] Plantilla de testimonio
