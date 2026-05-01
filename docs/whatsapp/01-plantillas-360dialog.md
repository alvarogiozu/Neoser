# Plantillas WhatsApp 360dialog - NeoSer

> Registrar en hub.360dialog.com > Templates. Meta aprueba en 1-24h.
> Idioma: es | Formato: sin emojis excesivos (Meta rechaza).

---

## 1. neoser_bienvenida

- **Categoria**: MARKETING
- **Uso**: Envio automatico al capturar lead con wa_consent=true
- **Trigger**: POST /api/contact-leads (automatico)

```
Hola {{1}}, bienvenida a NeoSer - Maternidad y Medicina Humanizada.

Somos un equipo dedicado a acompanarte en cada etapa de tu maternidad con calidez y profesionalismo en Chiclayo.

Un asesor revisara tu consulta y te contactara en breve.

Responde SALIR si no deseas recibir mas mensajes.
```

**Variables**: {{1}} = fullName del lead

---

## 2. neoser_seguimiento

- **Categoria**: MARKETING
- **Uso**: Envio manual o workflow HubSpot 24h despues del primer contacto
- **Trigger**: Diana / workflow HubSpot

```
Hola {{1}}, soy del equipo NeoSer.

Vimos tu consulta sobre {{2}}. Queremos asegurarnos de que tengas toda la informacion que necesitas.

Si tienes alguna duda adicional, responde a este mensaje y te atendemos.

Responde SALIR si no deseas recibir mas mensajes.
```

**Variables**: {{1}} = nombre, {{2}} = serviceInterest del lead

---

## 3. neoser_recordatorio

- **Categoria**: UTILITY
- **Uso**: Recordar cita, clase o evento programado
- **Trigger**: Diana manual o cron futuro

```
Recordatorio NeoSer

Hola {{1}}, te recordamos que {{2}} esta programado para el {{3}} a las {{4}}.

Ubicacion: Chiclayo

Si necesitas reprogramar, responde a este mensaje.
```

**Variables**: {{1}} = nombre, {{2}} = curso/cita, {{3}} = fecha, {{4}} = hora

---

## 4. neoser_reactivacion

- **Categoria**: MARKETING
- **Uso**: Leads inactivas 14+ dias (workflow HubSpot "Perdida 14d")
- **Trigger**: workflow HubSpot o Diana manual
- **Frecuencia maxima**: 1 por lead cada 30 dias

```
Hola {{1}}, te extrañamos en NeoSer.

Tenemos novedades que podrian interesarte: {{2}}

Como parte de nuestra comunidad, tienes un beneficio especial. Escribenos para conocer los detalles.

Responde SALIR si no deseas recibir mas mensajes.
```

**Variables**: {{1}} = nombre, {{2}} = curso/novedad destacada

---

## 5. neoser_confirmacion_pago

- **Categoria**: UTILITY
- **Uso**: Confirmar inscripcion y pago exitoso
- **Trigger**: Despues de validar pago (manual inicialmente)

```
Pago confirmado - NeoSer

Hola {{1}}, tu inscripcion a {{2}} ha sido registrada exitosamente.

Monto: S/ {{3}}
Recibiras tu boleta por correo electronico.

Proximamente te enviaremos los accesos a tu aula virtual.

Si tienes alguna consulta, responde aqui.
```

**Variables**: {{1}} = nombre, {{2}} = curso, {{3}} = monto

---

## Notas para registro en 360dialog

1. **NO usar tildes ni caracteres especiales** en el body de la plantilla al registrarla (Meta los acepta pero algunos BSPs fallan). Usar texto plano.
2. Categoria UTILITY no requiere opt-out explícito, pero igual lo incluimos en las de MARKETING.
3. Cada plantilla debe tener sample values al registrar. Ejemplo: {{1}}="María García", {{2}}="Curso Prenatal".
4. Si Meta rechaza, revisar: no urgencia falsa, no claims medicos sin disclaimer, no emojis excesivos.
