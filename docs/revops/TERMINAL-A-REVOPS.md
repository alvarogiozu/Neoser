# Terminal A — CRM / Operación Comercial (RevOps)

> **Owner**: Claude A  
> **Scope**: Pipeline comercial, campos de lead, automatizaciones HubSpot, operación diaria de Diana  
> **No toca**: código de la app, APIs, SQL, decisiones de arquitectura  
> **Última actualización**: 2026-04-20

---

## Rol

Terminal A diseña y configura **toda la operación comercial** de NeoSer dentro de HubSpot Free. No escribe código — define contratos que Terminal C implementa, y estrategias que Diana ejecuta desde su celular.

**En una frase**: soy el que decide qué pasa con cada lead desde que entra hasta que paga (o se va), y cómo Diana lo gestiona sin perder la cabeza.

---

## Entregables completados

### Iteración 1 — P0 Operativo (done)

| Entregable | Estado | Descripción |
|-----------|--------|-------------|
| Pipeline HubSpot | done | 6 etapas: Lead Nueva → Contactada → Interesada → Propuesta Enviada → Inscrita / Perdida |
| Campos obligatorios | done | Contact: whatsapp, semanas_gestacion, fuente_origen, wa_consent. Deal: servicio_interes, fecha_parto |
| Contrato API para Terminal C | done | POST /contacts + POST /deals con body exacto, campos y tipos definidos |
| 3 Automatizaciones | done | Workflow 1: bienvenida inmediata. Workflow 2: seguimiento 24h. Workflow 3: perdida 14d |
| Guion diario Diana | done | "Café con CRM" — 10 min cada mañana, 5 pasos |

### Iteración 2 — Innovación Operativa (done)

| Documento | Archivo | Estado | Qué resuelve |
|-----------|---------|--------|-------------|
| Lifecycle Nurturing | `01-lifecycle-nurturing.md` | done | Mensajes automáticos por semana de gestación — el sistema sabe qué decir y cuándo |
| Speed-to-Lead SLA | `02-speed-to-lead-sla.md` | done | Tiempos máximos de respuesta por fuente — ads <5min, web <15min |
| Reactivación Playbook | `03-reactivation-playbook.md` | done | 3 niveles para recuperar leads "perdidas" — en maternidad nadie está realmente perdida |
| Motor de Referidos | `04-referral-engine.md` | done | Programa "Mamá recomienda Mamá" con tracking en HubSpot, costo cero |
| Dashboard Semanal | `05-weekly-dashboard-diana.md` | done | 5 números cada lunes en 5 min para que Diana tome decisiones con datos |
| Cross-sell Lifecycle | `06-cross-sell-lifecycle.md` | done | Mapa de siguiente servicio automático — sube LTV de 1 a 2-3 compras por mamá |

---

## Contratos activos con otros terminales

### → Terminal C (Backend)

**Contrato API HubSpot — Crear contacto:**
```
POST https://api.hubapi.com/crm/v3/objects/contacts
Authorization: Bearer {HUBSPOT_ACCESS_TOKEN}

{
  "properties": {
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "whatsapp": "string (+51...)",
    "fuente_origen": "web_form | meta_ads | google_ads | ig_organico | whatsapp_directo | referida | otro",
    "wa_consent": "true | false",
    "semanas_gestacion": "string (opcional)"
  }
}
```

**Contrato API HubSpot — Crear deal:**
```
POST https://api.hubapi.com/crm/v3/objects/deals
Authorization: Bearer {HUBSPOT_ACCESS_TOKEN}

{
  "properties": {
    "dealname": "Lead Web - {firstname} {lastname}",
    "dealstage": "lead_nueva",
    "pipeline": "nuevas_mamas_neoser",
    "servicio_interes": "curso_prenatal | curso_postnatal | acompanamiento_individual | seminario | otro",
    "fecha_parto": "YYYY-MM-DD (opcional)"
  }
}
```

**Variable de entorno requerida:** `HUBSPOT_ACCESS_TOKEN` en Vercel/Supabase.

**Estado**: Terminal C ya implementó sync a HubSpot no-bloqueante en `contact-leads/route.ts`. Contrato cumplido.

### → Terminal B (WhatsApp 360dialog)

**Lo que Terminal B necesita de mí:**
- Campo `wa_consent` ya incluido en contrato y en formulario web — compliance cubierto
- Etapas del pipeline para mapear plantillas WA por etapa (entregado en iteración 1)

**Lo que yo necesito de Terminal B:**
- Templates aprobados de 360dialog para nurturing por lifecycle (P1, no bloquea hoy)
- Reglas anti-baneo para workflows que disparen mensajes WA

### → Terminal D (Delivery/QA)

**Lo que Terminal D necesita de mí:**
- Nada técnico — mis entregables son configuración HubSpot UI + documentos operativos
- Terminal D ya tiene nota de que `HUBSPOT_ACCESS_TOKEN` es env var requerida en staging

---

## Campos custom completos (referencia para configurar en HubSpot)

### En Contact (propiedades de contacto)
| Campo | Nombre interno | Tipo | Opciones | Prioridad |
|-------|---------------|------|----------|-----------|
| WhatsApp | `whatsapp` | Phone | — | P0 |
| Semanas gestación | `semanas_gestacion` | Text | — | P0 |
| Fuente de origen | `fuente_origen` | Dropdown | meta_ads, google_ads, ig_organico, whatsapp_directo, referida, web_form, otro | P0 |
| Consentimiento WA | `wa_consent` | Checkbox | true/false | P0 |
| Referida por | `referida_por` | Text | — | P1 |
| No contactar | `do_not_contact` | Checkbox | true/false | P1 |
| Intentos reactivación | `reactivation_count` | Number | 0-3 | P1 |

### En Deal (propiedades de negocio)
| Campo | Nombre interno | Tipo | Opciones | Prioridad |
|-------|---------------|------|----------|-----------|
| Servicio de interés | `servicio_interes` | Dropdown | curso_prenatal, curso_postnatal, acompanamiento_individual, seminario, otro | P0 |
| Fecha estimada parto | `fecha_parto` | Date | — | P0 |
| Siguiente servicio | `siguiente_servicio` | Dropdown | (mismas opciones que servicio_interes) | P1 |

---

## Workflows HubSpot (5/5 slots en Free)

| # | Nombre | Trigger | Acción | Prioridad |
|---|--------|---------|--------|-----------|
| 1 | Bienvenida Lead | Contacto creado | Email bienvenida + tarea Diana "Contactar <1h" | P0 |
| 2 | Seguimiento 24h | Deal 24h en Lead Nueva o Contactada | Tarea Diana "Seguimiento WA" | P0 |
| 3 | Auto-Perdida 14d | Deal 14d sin actividad | Mover a Perdida + email "te extrañamos" | P0 |
| 4 | Nurturing Embarazo | Basado en fecha_parto (semanas restantes) | Emails educativos + tareas Diana por trimestre | P1 |
| 5 | Nurturing Postparto | fecha_parto ya pasó | Email curso postnatal + tarea cross-sell | P1 |

---

## Pendientes (bloqueados por inputs externos)

| Pendiente | Bloqueado por | Acción cuando se desbloquee |
|-----------|--------------|----------------------------|
| Conectar Meta/Google Ads a HubSpot | Diana entrega accesos de ads | Settings → Marketing → Ads en HubSpot |
| Email template de bienvenida | Diana provee contenido / PDF | Crear en HubSpot → Marketing → Email |
| Emails educativos por trimestre | Diana provee contenido | Crear 3-4 emails y asignar a Workflow 4 |
| Verificar límites de Workflows Free | Acceso a cuenta HubSpot | Confirmar que los 5 workflows caben |

---

## Changelog

| Fecha | Iteración | Qué cambió |
|-------|-----------|-----------|
| 2026-04-20 | T-1 | Pipeline, campos P0, 3 automatizaciones, contrato API, guion Diana |
| 2026-04-20 | T-2 | 6 documentos de innovación: nurturing, SLA, reactivación, referidos, dashboard, cross-sell |
