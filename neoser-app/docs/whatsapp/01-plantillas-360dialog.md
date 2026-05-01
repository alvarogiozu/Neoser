# Plantillas 360dialog NeoSer

Plantillas base para registrar en Meta via 360dialog.

## Recomendaciones
- Idioma: `es`.
- En plantillas MARKETING incluir opcion de baja: `Responde SALIR si no deseas recibir mas mensajes`.
- Usar nombres consistentes con codigo (`NEOSER_TEMPLATES`).

## 1) `neoser_bienvenida`
- Categoria: `MARKETING`
- Body:
```
Hola {{1}}, gracias por escribir a NeoSer.

Somos un centro de maternidad y medicina humanizada en Chiclayo.
Un asesor te ayudara con la informacion que necesitas.

Responde SALIR si no deseas recibir mas mensajes.
```
- Variables:
  - `{{1}}`: nombre de la persona

## 2) `neoser_seguimiento`
- Categoria: `MARKETING`
- Body:
```
Hola {{1}}, te escribimos sobre {{2}}.
Estamos listos para ayudarte a resolver dudas y orientarte.

Responde SALIR si no deseas recibir mas mensajes.
```
- Variables:
  - `{{1}}`: nombre
  - `{{2}}`: servicio/curso

## 3) `neoser_recordatorio`
- Categoria: `UTILITY`
- Body:
```
Hola {{1}}, recordatorio de {{2}} para {{3}} a las {{4}}.
Si necesitas reprogramar, responde a este mensaje.
```
- Variables:
  - `{{1}}`: nombre
  - `{{2}}`: evento/servicio
  - `{{3}}`: fecha
  - `{{4}}`: hora

## 4) `neoser_reactivacion`
- Categoria: `MARKETING`
- Body:
```
Hola {{1}}, tenemos novedades sobre {{2}} en NeoSer.
Si deseas retomar tu proceso, te ayudamos por este medio.

Responde SALIR si no deseas recibir mas mensajes.
```
- Variables:
  - `{{1}}`: nombre
  - `{{2}}`: novedad/servicio

## 5) `neoser_confirmacion_pago`
- Categoria: `UTILITY`
- Body:
```
Hola {{1}}, confirmamos tu pago para {{2}} por S/ {{3}}.
Te enviaremos los siguientes pasos por este canal.
```
- Variables:
  - `{{1}}`: nombre
  - `{{2}}`: curso/servicio
  - `{{3}}`: monto
