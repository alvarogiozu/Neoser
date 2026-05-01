---
name: NeoSer - Definición del proyecto (Paso 0.1)
description: Scope inicial: qué hace, usuarios, plataforma, datos, login, pagos, referencias
---

# NeoSer — Definición del proyecto

> Documento base de contexto. Antes de empezar cualquier feature, revisar que encaje aquí. Si algo cambia, editar este archivo.

---

## 1. ¿Qué hace la app?

NeoSer es un **sitio web institucional + capa inicial de operacion digital** para un centro de maternidad y medicina humanizada en Chiclayo (Perú). La app captura leads desde la landing, los lleva al CRM (HubSpot), integra reservas y permite operar cursos e inscripciones en nivel basico.

- **V1 (en ejecucion):** Landing institucional + reservas + CRM leads + cursos/inscripciones basicas + email marketing inicial + SEO/analytics.
- **V2 (pendiente):** Aula virtual e-learning completa con progreso academico, foro y certificados avanzados.

---

## 2. ¿Quién la va a usar?

| Rol | Volumen esperado | Nivel técnico |
|---|---|---|
| **Gestantes / madres** (público objetivo) | Tráfico desde Meta/Google Ads activos | Bajo |
| **Diana Silva** (dueña / admin) | 1 persona, opera sola | Bajo (10–15 min/día) |
| **Álvaro** (dev / consultor RevOps) | 1 persona | Alto |

---

## 3. ¿Qué plataforma?

**Web** (mobile-first, responsive). Sin app móvil nativa.

- `website/` → sitio HTML estático
- `neoser-app/` → app Next.js (Fase 2 / aula virtual)
- Referencia visual: **saludmentalperinatal.es**

---

## 4. ¿Qué datos maneja?

**V1:** Leads (nombre, teléfono, email, semana de gestación, origen), reservas, cursos basicos e inscripciones

**V2:** Cuentas de alumnas, progreso avanzado, pagos completos, foro, certificados

> Datos personales de salud — no exponer en logs ni compartir con terceros sin consentimiento.

---

## 5. ¿Necesita login?

- **V1 → Opcional basico.** Login/panel admin solo para operación de CRM y gestión interna.
- **V2 → SÍ.** Login completo para alumnas y panel admin expandido.

---

## 6. ¿Necesita pagos?

- **V1 → Opcional basico.** Inscripción sin pagos complejos como flujo inicial.
- **V2 → SÍ.** Pasarela peruana completa (Culqi / Izipay / Mercado Pago / Yape).

---

## 7. Ejemplos de apps similares

- **saludmentalperinatal.es** — referencia oficial de la clienta
- Hotmart / Teachable / Thinkific — solo como referencia funcional para Fase 2

---

## Restricciones que aplican siempre

- Diana tiene nivel técnico bajo y opera sola → **simplicidad sobre features**
- Ads ya corriendo (Meta + Google) → los formularios no pueden romperse
- Scope operativo congelado en `docs/00-contexto/01-scope-freeze-v1.md` → cambios fuera de alcance solo por Change Request
- Idioma: español (Perú) | Zona horaria: America/Lima (UTC-5)
