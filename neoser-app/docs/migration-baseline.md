# Baseline de migracion NeoSer

## Fuentes originales auditadas
- `../website/index.html`
- `../website/css/styles.css`
- `../website/js/main.js`

## Dependencias visuales detectadas
- Tailwind por CDN en runtime.
- AOS `2.3.4`.
- GSAP `3.12.5` + ScrollTrigger.
- Swiper `11`.
- Lucide UMD.

## Inventario de assets referenciados
Los siguientes archivos se referencian en HTML pero no existen en `website/assets` dentro de este repositorio:
- `assets/logo-white.png`
- `assets/logo-color.png`
- `assets/highlight-perine.jpg`
- `assets/highlight-prenatal.jpg`
- `assets/highlight-cursos.jpg`
- `assets/highlight-bebe.jpg`
- `assets/highlight-fundadores.jpg`
- placeholders adicionales en comentarios (`team-*.jpg`, `news-*.jpg`).

## Decision tecnica aplicada
- Se crea base funcional en Next.js con mismas secciones/IDs (`inicio`, `servicios`, `cursos`, `nosotros`, `noticias`, `contacto`).
- Se habilita backend base (Supabase + APIs + RLS) para fase de producto.
- Se deja pendiente el port pixel-perfect final de animaciones al disponer del set completo de assets.
