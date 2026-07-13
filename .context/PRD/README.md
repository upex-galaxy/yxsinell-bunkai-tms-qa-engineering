# PRD/ - Product Requirements Document (Phase 2: Architecture)

Este directorio contiene **requisitos de producto** descubiertos desde un proyecto existente.

## Propósito

La carpeta `PRD/` guarda información de producto orientada a usuario:

- Qué hace el producto (executive summary).
- Quién lo usa (user personas).
- Cómo interactúan los usuarios con el producto (user journeys).
- Qué features existen (feature inventory).

## Archivos Esperados

| Archivo | Descripción | Generado por |
|---|---|---|
| `executive-summary.md` | Propósito y visión del producto | skill `/project-discovery` |
| `user-personas.md` | Perfiles de usuarios objetivo | skill `/project-discovery` |
| `user-journeys.md` | Flujos y rutas clave de usuario | skill `/project-discovery` |
| `feature-inventory.md` | Catálogo de features existentes | skill `/project-discovery` |

## Cómo Generar

Cargar la skill `/project-discovery` y ejecutar Phase 2 (Architecture) después de completar Phase 1.

### Prerrequisitos

- `.context/business/business-model.md` y `domain-glossary.md` poblados (Phase 1 completa).
- Acceso al código fuente (frontend routes, UI components).
- Opcional: acceso a analytics.
- Opcional: acceso a documentos de investigación de usuarios.

## Fuentes de Discovery

La información de esta carpeta se DESCUBRE desde:

1. **Análisis de frontend**
   - Las rutas revelan user journeys.
   - La estructura de componentes revela features.
   - Los campos de formulario revelan interacciones de usuario.

2. **Análisis de backend**
   - Los endpoints API revelan capacidades.
   - El código de permisos/roles revela tipos de usuario.

3. **Documentación existente**
   - Product specs en Confluence/Notion.
   - User stories en Jira/Azure DevOps.
   - Materiales de marketing.

4. **Producto corriendo**
   - Exploración UI y screenshots.
   - Testing de features.

## Cuándo Leer Esta Carpeta

- **Phase 5 (Shift-Left Testing):** antes de crear test plans.
- **Phase 10 (Exploratory Testing):** para entender comportamiento esperado.
- **Cualquier documentación de tests:** para mapear tests a features.

---

**Skill relacionada:** `/project-discovery` (Phase 2: Architecture -- PRD flow)
**Carpeta compañera:** `SRS/` (technical specifications)
