# NeoSer — Scope Freeze V1 (Anexo Completo)

Documento operativo para ejecutar el V1 con alcance congelado. Sirve como fuente unica de verdad para el equipo tecnico y para validar entregables sin ambiguedad.

## 1) Alcance congelado de V1

Se ejecuta el V1 conforme al anexo del contrato firmado y a la cotizacion validada para este proyecto:

- Web institucional responsive con secciones: Inicio, Nosotros, Servicios, Cursos, Noticias, Contacto y Reserva.
- Sistema de reserva con calendario, formulario previo y confirmacion automatica.
- Integraciones tecnicas: Supabase, HubSpot, Cal.com, WhatsApp, Vercel.
- Plataforma de cursos + CRM alumnos (nivel basico): catalogo, inscripcion online y base segmentada.
- Email marketing inicial: segmentacion de contactos, campanas base y automatizacion inicial.
- SEO basico + Google Maps + setup de GA4 y Search Console.

## 2) Exclusiones explicitas de V1 (todo esto va a cotizacion aparte)

- Aula virtual completa (LMS), progreso academico avanzado, foros, certificados avanzados.
- Integraciones fuera del stack congelado (por ejemplo, nuevos BSP de WhatsApp distintos al definido en fase de implementacion).
- Automatizaciones avanzadas no listadas en este documento.
- Reescritura de arquitectura por cambios de preferencia durante ejecucion.
- Funcionalidades mobile nativas (iOS/Android).

## 3) Entregables obligatorios (DoD funcional)

### Web institucional
- Landing funcional en 3 breakpoints (mobile, tablet, desktop).
- Navegacion estable y contenido final visible sin placeholders criticos.

### Captacion y CRM
- Formulario de lead funcionando con validaciones.
- Lead guardado en Supabase.
- Sync hacia HubSpot no bloqueante.

### Reservas
- Integracion visible de Cal.com en seccion de reserva.
- Reserva confirmada persiste en Supabase.
- Reserva genera/actualiza seguimiento comercial en HubSpot.

### Cursos e inscripcion
- Catalogo de cursos publicado desde DB.
- Inscripcion online funcionando.
- Segmentacion base disponible por estado/curso/fuente.

### Mensajeria y email
- Capa de envio de WhatsApp con proveedor configurable.
- Plantillas base operativas con control de consentimiento y opt-out.
- Campanas iniciales de email y al menos 2 automatizaciones activas.

### SEO y analitica
- Metadatos basicos, sitemap y robots configurados.
- Google Maps embebido con fallback.
- GA4 y Search Console verificadas.

## 4) Dependencias externas del cliente

Para no bloquear cronograma, la contratante debe entregar:

- Accesos: HubSpot, Supabase, Vercel, dominio DNS, Google (GA4/GSC), Cal.com.
- Contenido final de secciones, branding, politica de privacidad/consentimiento.
- Aprobaciones de plantillas WhatsApp y remitente de email.

## 5) Riesgos y regla de cambios

- Si falta un acceso o contenido critico, el hito asociado se reprograma.
- Todo cambio funcional fuera del alcance congelado se registra como Change Request.
- Change Request requiere aprobacion por escrito y cotizacion independiente.

## 6) SLA de soporte posterior (segun contrato)

- Respuesta inicial: hasta 48 horas habiles.
- Incidencia critica: hasta 24 horas habiles.
- Consultas generales: hasta 72 horas habiles.
- Correcciones/ajustes: hasta 2 semanas calendario segun complejidad.

## 7) Responsables operativos

- Alvaro: arquitectura, backend, integraciones, seguridad, despliegue y QA tecnico.
- Hermano: UI/UX, maquetacion responsive, estados visuales y QA visual.
- Compartido: criterios de aceptacion, UAT final y salida a produccion.

