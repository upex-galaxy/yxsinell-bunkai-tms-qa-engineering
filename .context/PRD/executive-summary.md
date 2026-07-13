# Executive Summary — Bunkai PRD

> Producto: **Bunkai** (`分解`) — Test Management System open-core.
> Discovery date: 2026-07-12
> Confianza: **Alta** para el core MVP implementado/documentado; **Media** para capacidades Phase 2/3 todavía documentadas como futuras.

## Problem Statement

Los TMS tradicionales se describen en la documentación del producto como bóvedas de documentos con ejecución agregada encima. El problema no es solo almacenar test cases, sino que esos test cases suelen quedar duplicados, poco trazables y desconectados de runs y bugs. Fuente: `../upex-bunkai-tms/.context/business/business-model.md:9-21`, `../upex-bunkai-tms/.context/PRD/executive-summary.md:10-20`.

Bunkai intenta resolverlo desde el modelo de datos: Workspace → Project → Module → User Story → Acceptance Criterion → ATC → Test → Run. La estructura impide que la trazabilidad sea opcional y convierte los ATCs reutilizables en la unidad central de mantenimiento. Fuente: `../upex-bunkai-tms/.context/PRD/executive-summary.md:22-35`, `../upex-bunkai-tms/.context/business/domain-glossary.md:67-84`.

Alternativas actuales mencionadas: Xray, Zephyr Scale, TestRail y qTest. Fuente: `../upex-bunkai-tms/.context/business/business-model.md:11`.

## Solution Overview

### Product Vision

Bunkai es un TMS API-first que fuerza trazabilidad estructural y reutilización de ATCs para que QA pueda planificar, ejecutar, reportar y eventualmente automatizar sobre el mismo modelo de datos.

### Core Capabilities

| # | Feature | Problema que resuelve | Evidencia |
|---|---|---|---|
| 1 | Auth + workspace routing | Entrada segura y separación por workspace | `../upex-bunkai-tms/app/page.tsx:8-12`, `../upex-bunkai-tms/middleware.ts:8-51` |
| 2 | Project workbench con explorer/table/mindmap | Navegación de módulos, ATCs y tests desde un workspace de trabajo | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/page.tsx:12-28` |
| 3 | ATC authoring anclado a story/AC/module | Evita ATCs huérfanos y duplicación libre | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/atcs/new/page.tsx:45-99`, `../upex-bunkai-tms/lib/atcs/validation.ts:35-47` |
| 4 | Tests y Runs | Convierte cadenas de ATCs en ejecuciones con estado | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/runs/[runId]/page.tsx:14-70`, `../upex-bunkai-tms/lib/runs/validation.ts:16-65` |
| 5 | API v1 + OpenAPI + PAT | Permite CLI/agents y automatización headless | `../upex-bunkai-tms/app/api/v1/route.ts:12-19`, `../upex-bunkai-tms/app/api/openapi/route.ts:4-26`, `../upex-bunkai-tms/lib/api/pat.ts:8-28` |

### Key Differentiators

- **Tests como cadenas de ATCs**, no blobs de pasos libres. Fuente: `../upex-bunkai-tms/.context/business/domain-glossary.md:79-80`.
- **Auth dual cookie/PAT** para UI humana y agentes/API. Fuente: `../upex-bunkai-tms/lib/api/handler.ts:12-25`, `../upex-bunkai-tms/lib/api/pat.ts:5-28`.
- **Run history con snapshots** para preservar histórico aunque cambien ATCs. Fuente: `../upex-bunkai-tms/.context/business/domain-glossary.md:81`, `../upex-bunkai-tms/.context/SRS/architecture-specs.md:92-123`.

## Success Metrics

### Tracked Metrics

No se verificaron llamadas concretas a analytics/event tracking en Phase 2. Las métricas documentadas son objetivos de producto, no tracking implementado confirmado.

### Inferred KPIs

| Metric | Type | Implementación esperada | Source |
|---|---|---|---|
| Workspaces que crean módulo + ATC + Test + Run | Adoption | Derivable desde tablas core y runs | `../upex-bunkai-tms/.context/PRD/executive-summary.md:37-49` |
| ATCs por workspace activo | Engagement | Conteo `atcs` por `project/workspace` | `../upex-bunkai-tms/.context/business/business-model.md:116-123` |
| Tests-per-ATC ratio | Engagement / reuse | Join `test_steps` ↔ `atcs` | `../upex-bunkai-tms/.context/business/business-model.md:116-123` |
| Run pass/fail/blocked by environment | Quality | Tablas `runs`, `run_atcs`, `run_steps` | `../upex-bunkai-tms/.context/SRS/architecture-specs.md:92-123` |

### Unknown Metrics

- Analytics real no verificado.
- No se verificó dashboard operativo de métricas.
- No se verificaron targets con telemetry real.

## Target Users

| Persona | System Role | Need | Evidence |
|---|---|---|---|
| Senior QA Engineer | `member` / power user | Crear ATCs, tests y runs confiables | `../upex-bunkai-tms/.context/PRD/user-personas.md:7-42` |
| QA Lead / Manager | `admin` / `owner` | Ver coverage, trazabilidad y estado ejecutivo | `../upex-bunkai-tms/.context/PRD/user-personas.md:45-79` |
| Developer | `member` / collaborator | Entender cobertura y bugs vinculados a cambios | `../upex-bunkai-tms/.context/PRD/user-personas.md:82-114` |
| AI Test Agent | PAT principal | Ejecutar/leer/reportar vía API | `../upex-bunkai-tms/.context/PRD/user-personas.md:117-146`, `../upex-bunkai-tms/lib/api/pat.ts:12-28` |

## Product Scope

### Incluido actualmente / evidenciado

- Auth redirect y protección de rutas `/projects` y `/onboarding`.
- Workspaces/projects/modules.
- User Stories y Acceptance Criteria.
- ATC authoring, search, duplicate, usage y update propagation.
- Tests como cadenas y reorder/tags.
- Runs con start/abort/finish y runner view.
- OpenAPI público + docs Scalar.
- PAT scopes para API/agents.

### No incluido o no verificado como MVP real

- CI/CD local no verificado.
- Self-hosted Docker Compose todavía aparece como Phase 2.
- WebSocket/Redis agentic protocol aparece como Phase 2.
- SSO/SAML/audit enterprise aparece como Phase 3.
- Observability Sentry/PostHog no verificada como código activo.

### Future Indicators

- Self-hosted edition: `../upex-bunkai-tms/.context/SRS/architecture-specs.md:1-4`.
- Agentic streaming Phase 2: `../upex-bunkai-tms/.context/PRD/user-journeys.md:149-152`.
- Enterprise compliance horizon: `../upex-bunkai-tms/.context/SRS/non-functional-specs.md:98-102`.

## Discovery Gaps

| Gap | Impact | Suggested Source |
|---|---|---|
| Analytics/tracking real | Métricas no se pueden afirmar como implementadas | Buscar SDK/calls o revisar dashboard product analytics |
| CI/CD | Regression readiness incierta | Confirmar workflows fuera del repo o crear `.github/workflows/` |
| Bugs schema/feature parity | Defect management podría estar documentado antes que implementado | Revisar migraciones posteriores o DB live |
| Self-hosted scope | Evitar testear features futuras como MVP | Roadmap/product owner |

## QA Relevance

### Critical Testing Areas

- Auth cookie + PAT parity.
- RLS/workspace isolation.
- ATC traceability mandatory.
- Test chain reorder y duplicate handling.
- Run lifecycle: start, abort, finish, resume/read-only permissions.
- OpenAPI availability and drift against route handlers.

### Risk Areas

- Un mismo Supabase project ref para ambientes puede contaminar datos.
- Docs/code drift: usar migraciones/código como fuente final para tests.
- Features Phase 2/3 pueden aparecer en docs pero no estar implementadas.

## Document References

| Documento | Estado |
|---|---|
| `.context/PRD/user-personas.md` | Generado en Phase 2 |
| `.context/PRD/user-journeys.md` | Generado en Phase 2 |
| `.context/SRS/architecture.md` | Generado en Phase 2 |
| `.context/SRS/functional-specs.md` | Generado en Phase 2 |
| `.context/SRS/non-functional-specs.md` | Generado en Phase 2 |
| `.context/business/business-feature-map.md` | Pendiente: comando standalone `/business-feature-map` |
