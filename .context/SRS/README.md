# SRS/ - Software Requirements Specification (Phase 2-3: Architecture & Infrastructure)

Este directorio contiene **especificaciones técnicas** descubiertas desde un proyecto existente.

## Propósito

La carpeta `SRS/` guarda detalles técnicos de implementación:

- Arquitectura del sistema (componentes, conexiones).
- Contratos API (endpoints, payloads).
- Especificaciones funcionales (qué hace el sistema).
- Requisitos no funcionales (performance, security).
- Setup de infraestructura (deployment, CI/CD).

## Archivos Esperados

| Archivo | Descripción | Generado por |
|---|---|---|
| `architecture.md` | Diagramas de arquitectura del sistema (C4, ERD) | skill `/project-discovery` |
| `functional-specs.md` | Especificaciones de comportamiento de features | skill `/project-discovery` |
| `non-functional-specs.md` | Performance, security, scalability | skill `/project-discovery` |
| `infrastructure.md` | Deployment, CI/CD, environments | skill `/project-discovery` |

> **Los contratos API NO son un archivo de esta carpeta.** La superficie técnica vive en `api/openapi-types.ts` (generado con `bun run api:sync` desde el OpenAPI spec del proyecto). El ángulo de negocio vive en `.context/business/business-api-map.md` (producido por `/business-api-map`). No escribir manualmente un `api-contracts.md` paralelo.

## Cómo Generar

Cargar la skill `/project-discovery`:

1. Ejecutar Phase 2 (Architecture) -- genera SRS architecture/functional/non-functional specs.
2. Ejecutar Phase 3 (Infrastructure) -- complementa `infrastructure.md`.

### Prerrequisitos

- `.context/business/business-model.md` y `domain-glossary.md` poblados (Phase 1).
- `.context/PRD/` poblado (Phase 2 PRD prompts).
- Acceso al código fuente (backend, frontend).
- Acceso al schema de base de datos.
- Opcional: acceso a OpenAPI/Swagger specs.
- Opcional: acceso a configuración CI/CD.

## Fuentes de Discovery

La información de esta carpeta se DESCUBRE desde:

1. **Análisis de backend**
   - Route definitions → API contracts.
   - Database models → estructura de datos.
   - Middleware → autenticación/autorización.

2. **OpenAPI/Swagger Specs**
   - Documentación API existente.
   - Schemas request/response.

3. **Inspección de base de datos**
   - Análisis de schema vía MCP (DBHub).
   - Relaciones y constraints de tablas.

4. **Archivos de infraestructura**
   - `.github/workflows/` → CI/CD pipelines.
   - `docker-compose.yml` → arquitectura de servicios.
   - `Dockerfile` → build process.
   - Config cloud (terraform, serverless.yml).

5. **Archivos de configuración**
   - `package.json` → dependencias, scripts.
   - Templates de env vars.
   - Config files (`next.config.js`, etc.).

## Cuándo Leer Esta Carpeta

- **Shift-Left Testing:** contratos API para integration tests.
- **Test Automation:** detalles técnicos para setup de automatización.
- **Regression/Shift-Right:** infraestructura para monitoreo y ejecución.
- **Cualquier API testing:** para entender endpoints y contratos.

---

**Skill relacionada:** `/project-discovery` (Phases 2 and 3)

**Carpeta compañera:** `PRD/` (product specifications)
