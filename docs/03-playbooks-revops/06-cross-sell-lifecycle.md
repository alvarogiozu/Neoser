# NeoSer — Cross-sell por Ciclo de Vida

## La oportunidad oculta

Cada clienta de NeoSer tiene un ciclo natural de 12+ meses donde necesita diferentes servicios. Si Diana solo vende un curso, está dejando 3-4 ventas adicionales sobre la mesa.

## Mapa de servicios por etapa de vida

```
EMBARAZO TEMPRANO (sem 8-20)
  └→ Curso Prenatal (venta principal)
  └→ Acompañamiento Individual (upsell)

EMBARAZO AVANZADO (sem 20-36)
  └→ Curso Prenatal (si no compró antes — última oportunidad)
  └→ Seminarios específicos (periné, lactancia)

PRE-PARTO (sem 36-40)
  └→ Acompañamiento plan de parto (servicio premium)

POST-PARTO (0-3 meses)
  └→ Curso Postnatal (venta principal #2)
  └→ Acompañamiento Individual postnatal

POST-PARTO TARDÍO (3-12 meses)
  └→ Seminarios especializados (sueño bebé, alimentación)
  └→ Siguiente embarazo (referido o recompra en 1-3 años)
```

## Implementación: "Siguiente servicio sugerido"

### Campo en HubSpot Deal:
- `siguiente_servicio` (Dropdown): se llena automáticamente o por Diana al cerrar un deal

### Lógica:
| Si compró... | Siguiente servicio sugerido | Cuándo ofrecerlo |
|-------------|---------------------------|-------------------|
| Curso Prenatal | Curso Postnatal | 2 semanas post-parto |
| Curso Postnatal | Seminario especializado | 1 mes después |
| Acompañamiento Individual | Curso grupal | Al cerrar acompañamiento |
| Seminario suelto | Curso completo | 1 semana después |

### Cómo Diana lo opera:
1. Al marcar deal como "Inscrita" (won), HubSpot crea automáticamente un NUEVO deal en etapa "Lead Nueva" con:
   - Mismo contacto
   - `servicio_interes` = siguiente servicio sugerido
   - `dealname` = "Cross-sell - [nombre] - [servicio]"
2. Este deal aparece en el pipeline de Diana con fecha futura
3. Diana lo trabaja cuando llega el momento

### Resultado esperado:
- **LTV (lifetime value) por clienta sube de 1 compra a 2-3 compras**
- **CAC (costo adquisición) baja porque no necesitas ads para la segunda venta**
- **Diana no tiene que recordar nada — el sistema le dice a quién ofrecer qué y cuándo**
