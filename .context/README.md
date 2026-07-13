# .context/ - Directorio de Context Engineering

Este directorio contiene la documentación que la IA lee para trabajar sobre el proyecto.

## Estructura

```
.context/
├── business/                            # Contexto de negocio (fuente única)
│   ├── business-model.md               #   /project-discovery (Phase 1 — Constitution)
│   ├── domain-glossary.md              #   /project-discovery (Phase 1 — Constitution)
│   ├── business-data-map.md            #   /business-data-map
│   ├── business-feature-map.md         #   /business-feature-map
│   └── business-api-map.md             #   /business-api-map
├── PRD/                PHASE 2: Architecture - Product Requirements
├── SRS/                PHASE 2: Architecture - Software Requirements
├── ADR/                Architecture Decision Records — arquitectura de testing (append-only)
├── PBI/                PHASES 4+: Product Backlog (Specification, Testing)
├── reports/            Frameworks de testing por sprint (gestionados por /sprint-testing)
└── master-test-plan.md                 # /master-test-plan — qué testear y por qué
```

Las guías de workflow viven dentro de las skills de Claude Code en `.claude/skills/`. Cada skill trae su propio material en `references/`.

## Primeros Pasos

### Setup de Memoria del Proyecto

Cargá la skill `/project-discovery` en tu asistente AI. Esa skill:

1. Detecta la herramienta AI y genera el archivo de configuración correcto (`CLAUDE.md`, `GEMINI.md`, etc.).
2. Genera un `README.md` profesional.
3. Genera los artefactos `.context/` listados arriba.

### Fases del Proyecto

**Discovery (una vez, manejado end-to-end por `/project-discovery`):**

- Business constitution -> genera `business/business-model.md` y `business/domain-glossary.md`.
- Architecture -> genera `PRD/` y `SRS/`.
- Infrastructure -> complementa `SRS/`.
- Specification -> genera `PBI/`.

**Workflow QA (iterativo, vía skills):**

- `/sprint-testing` -- planificación, ejecución y reporting in-sprint por ticket.
- `/test-documentation` -- documentación TMS y priorización.
- `/test-automation` -- planificación KATA + código + review.
- `/regression-testing` -- ejecución de regresión y GO/NO-GO.

## Skills por Rol

| Rol | Skills primarias |
|---|---|
| QA Engineer | `/sprint-testing`, `/test-documentation` |
| QA Automation | `/test-automation`, `/regression-testing` |
| Cualquier rol | Sección "MCPs Available" de `CLAUDE.md` al usar MCPs |

## Archivos de Contexto Recomendados

Estos archivos se generan con la skill y comandos de discovery del proyecto. Si todavía no existen, crealos con el comando indicado:

| Archivo | Generador | Requerido para |
|---|---|---|
| `business/business-data-map.md` | comando `/business-data-map` | Entender flujos, entidades y eventos del sistema |
| `business/business-feature-map.md` | comando `/business-feature-map` | Catálogo de features, matriz CRUD, feature flags |
| `business/business-api-map.md` | comando `/business-api-map` | Modelo auth, endpoints críticos, arquitectura detrás de API |
| `master-test-plan.md` | comando `/master-test-plan` | Saber qué testear y por qué, priorizado por riesgo |
| `business/business-model.md` | `/project-discovery` (Phase 1 — Constitution) | Contexto de negocio para test planning |
| `business/domain-glossary.md` | `/project-discovery` (Phase 1 — Constitution) | Terminología consistente |
| `PRD/*.md` | `/project-discovery` (Phase 2 — Architecture) | Personas y user journeys |
| `SRS/*.md` | `/project-discovery` (Phase 2 + Phase 3 — Infrastructure) | Especificaciones técnicas y contratos API |
| `ADR/*.md` | Arquitecto QA humano, o `/project-discovery` (SRS/infra) · `/framework-development` · `/sprint-testing` — AI redacta, humano aprueba | **Excepción: append-only, nunca regenerar.** Decisiones de arquitectura de testing (runner, fixtures, isolation, flake policy); se superseden con ADR nuevo, no se sobreescriben. Ver `ADR/README.md` |
| `api/schemas/` | `bun run api:sync` | Tipos TypeScript derivados de OpenAPI para integration tests |

**Contexto mínimo viable:** `business/business-data-map.md` + `master-test-plan.md` (ejecutar esos dos comandos primero).

---

## Referencias

- **Memoria del proyecto:** `CLAUDE.md` (o equivalente para tu herramienta AI)
- **Context Engineering:** `../CONTEXT.md`
- **Workflow skills:** `.claude/skills/` (cada skill se describe en su `SKILL.md`)

---

**Última actualización:** 2026-07-12
