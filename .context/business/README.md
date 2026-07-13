# business/ - Contexto de Negocio

Hogar único para **todo el contexto de negocio** que lee la IA. Tiene dos grupos complementarios:

1. **Constitution outputs** — descubiertos una vez por `/project-discovery` Phase 1 (quién/qué/por qué).
2. **Business maps** — refrescables bajo demanda con los comandos `/business-*` (data, features, API).

## Archivos Esperados

### Phase 1 — Constitution outputs (generados por `/project-discovery`)

| Archivo | Descripción | Generado por |
|---|---|---|
| `business-model.md` | Business Model Canvas descubierto desde fuentes reales | skill `/project-discovery` (Phase 1) |
| `domain-glossary.md` | Terminología y definiciones del dominio | skill `/project-discovery` (Phase 1) |

### Business maps (generados por comandos standalone)

| Archivo | Descripción | Generado por |
|---|---|---|
| `business-data-map.md` | Entidades, flujos, state machines, triggers, integraciones | `/business-data-map` |
| `business-feature-map.md` | Catálogo de features, matriz CRUD, feature flags | `/business-feature-map` |
| `business-api-map.md` | Modelo auth, endpoints críticos, arquitectura detrás de API | `/business-api-map` |

## Cómo Generar

- **Phase 1 outputs** — cargar `/project-discovery` y ejecutar el flujo Phase 1 (Constitution) después de Phase 0 (Project Onboarding). Prerrequisitos: `.context/project-config.md`, acceso al código fuente y opcionalmente acceso a docs existentes (Confluence/Notion).
- **Business maps** — invocar cada comando standalone directamente (`/business-data-map`, `/business-feature-map`, `/business-api-map`). Consumen muchos tokens; conviene correrlos en sesión limpia, en ese orden.

## Fuentes de Discovery

La información acá se DESCUBRE, no se inventa, desde:

1. **Análisis de código fuente** — nombres de entidades/modelos, estructura de módulos, comentarios, docstrings.
2. **Schema de base de datos** — tablas, relaciones, tipos de campos.
3. **Documentación existente** — READMEs, wikis, Confluence/Notion, API docs, user guides.
4. **Producto corriendo** — exploración UI con Playwright MCP y observación de features.

## Cuándo Leer Esta Carpeta

- **Phase 2+** — antes de crear documentación PRD/SRS.
- **Phase 5+** — antes de escribir test cases (contexto de negocio para ATPs).
- **Cualquier trabajo QA** — para entender terminología del dominio y flujos críticos.
- **Planificación de automatización** — `business-data-map.md` es el input más usado para trabajo KATA.

---

**Skill relacionada:** `/project-discovery` (Phase 1: Constitution)
**Comandos relacionados:** `/business-data-map`, `/business-feature-map`, `/business-api-map`
**Carpetas compañeras:** `../PRD/` (Phase 2 product docs), `../SRS/` (Phase 2-3 technical specs)
