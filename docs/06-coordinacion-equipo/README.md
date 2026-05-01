# Coordinación de equipo

Documentos de proceso para cuando trabajan **múltiples agentes o personas en paralelo** (Cursor + varios Claudes, Álvaro + hermano, etc.).

## Cuándo entrar acá

- Antes de empezar una sesión nueva con otro agente IA → leer `sync-claudes-neoser.md` para saber el estado global.
- Antes de cerrar una sesión → actualizar `sync-claudes-neoser.md` con lo que se cambió.
- Si vas a trabajar en paralelo con otra terminal → seguir el protocolo de `paralelo-claude-cursor.md` para no pisarse.

## Archivos

| Archivo | Para qué |
|---|---|
| [`sync-claudes-neoser.md`](sync-claudes-neoser.md) | Estado global vivo del proyecto. Single source of truth entre sesiones. Se actualiza al inicio y al final de cada bloque de trabajo. |
| [`paralelo-claude-cursor.md`](paralelo-claude-cursor.md) | Protocolo de cómo dividir scope y ramas para trabajar en paralelo sin colisionar. |

## Regla principal

> 1 terminal = 1 scope = 1 rama.
> No tocar archivos fuera del scope asignado sin avisar en `sync-claudes-neoser.md`.
