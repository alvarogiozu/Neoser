# Branding NeoSer

Identidad visual oficial de NeoSer — Maternidad y Medicina Humanizada.

## Estructura

| Carpeta / archivo | Qué hay | Uso típico |
|---|---|---|
| [`manual-marca-neoser.pdf`](manual-marca-neoser.pdf) | Logos + paleta de colores oficial | **Punto de partida**. Cualquier decisión visual se valida acá primero. |
| [`logos/`](logos/) | Logos en color, blanco, negro, ícono y variantes (PNG y AI) | Web (`website/`, `neoser-app/public/`), RRSS, materiales impresos |
| [`fonts/`](fonts/) | Tipografías: Abhaya Libre (ExtraBold/SemiBold), Brush Script, Metropolis (Bold/ExtraBold) | Aplicar en CSS / componentes; cuando hagan falta para diseños nuevos |
| [`highlights/`](highlights/) | JPGs para highlights de Instagram (Bebé, Cursos, Fundadores, Periné, Prenatal, Testimonios) | Solo RRSS — no se usa en la web |
| [`plantillas-historia/`](plantillas-historia/) | Plantillas editables para Stories de Instagram | Solo RRSS — Diana las usa con su equipo |
| [`plantillas-reel/`](plantillas-reel/) | Plantillas editables para Reels | Solo RRSS |

## Paleta de colores oficial

(Tomada del `vigente-soporte-tecnico-2026.tex` / manual de marca):

- **Navy**: `#1B3A6B` (primario)
- **Navy oscuro**: `#0F2548`
- **Pink**: `#E8879B` (acento)
- **Pink oscuro**: `#D4637A`
- **Crema**: `#FFF9F5` (fondo)
- **Gris texto**: `#555555`
- **Gris claro**: `#E0E0E0`

## Reglas

- **Logos**: usar siempre desde `logos/` — no recrear ni recortar nuevos.
- **Fuentes**: si vas a embeber una en la web, copiarla a `neoser-app/public/fonts/` y referenciarla con `@font-face`. No subir las `.ai` ni `.otf` pesadas a producción.
- Los archivos `.ai` (Adobe Illustrator) están **gitignored** por tamaño. Existen en disco para que el equipo de diseño los edite localmente, pero no se versionan.
