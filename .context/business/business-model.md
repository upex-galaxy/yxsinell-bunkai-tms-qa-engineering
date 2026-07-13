# Modelo de Negocio — Bunkai

> Producto: **Bunkai** (`分解`) — Test Management System open-core.
> Confianza del discovery: **Alta** para visión/producto documentado; **Media** para pricing, CI/CD y observabilidad porque parte está planificada o no verificada en código.
> Fuentes principales: contexto versionado del repo objetivo, PRD/SRS y configuración del proyecto.

## Problem Statement

Los Test Management Systems tradicionales como Xray, Zephyr Scale, TestRail y qTest se describen en la documentación del producto como bóvedas de documentos con ejecución agregada encima. El dolor principal identificado es que almacenan test cases, pero no fuerzan disciplina de ingeniería QA: pasos duplicados, trazabilidad débil, reportes poco accionables y bug context separado del ciclo de testing. Fuente: `../upex-bunkai-tms/.context/business/business-model.md:9-21`, `../upex-bunkai-tms/.context/PRD/executive-summary.md:10-20`.

Bunkai ataca el problema desde el modelo de datos: un ATC no puede existir sin User Story y Acceptance Criterion, un Test se compone como cadena de ATCs, y los Bugs se anclan al ciclo de ejecución. La hipótesis central es que la estructura del producto enseña buena práctica QA por diseño, no por documentación externa. Fuente: `../upex-bunkai-tms/.context/business/business-model.md:21-29`, `../upex-bunkai-tms/.context/PRD/executive-summary.md:22-35`.

## Business Model Canvas

### 1. Customer Segments

| Segmento | Descripción | Found in | Confianza |
|---|---|---|---|
| QA engineers indie y equipos QA pequeños | Usuarios con dolor diario en Xray/Zephyr; potenciales evangelistas community/self-hosted | `../upex-bunkai-tms/.context/business/business-model.md:35-43` | Alta |
| Organizaciones mid-market | Equipos con Jira + Xray/Zephyr frustrados por mantenimiento y trazabilidad | `../upex-bunkai-tms/.context/business/business-model.md:39-41` | Alta |
| Empresas reguladas | Fintech, healthtech y legaltech con restricciones de soberanía de datos | `../upex-bunkai-tms/.context/business/business-model.md:41-42` | Alta |
| Audiencia de formación QA | Bootcamps, certificaciones y cursos de Quality Engineering | `../upex-bunkai-tms/.context/business/business-model.md:42` | Alta |

### 2. Value Propositions

| Propuesta | Evidencia | Found in | Confianza |
|---|---|---|---|
| Mantenimiento one-edit-many-tests | Editar un ATC actualiza todos los Tests que lo encadenan | `../upex-bunkai-tms/.context/business/business-model.md:44-52` | Alta |
| Trazabilidad estructural obligatoria | ATCs anclados a User Story + Acceptance Criterion | `../upex-bunkai-tms/.context/PRD/executive-summary.md:24-35` | Alta |
| Ejecución manual, agentic y automatizada sobre un mismo modelo | Tres modos comparables contra los mismos ATCs | `../upex-bunkai-tms/.context/business/business-model.md:48-50` | Alta |
| Defect management nativo | Bugs anclados a Module + ATC + Run | `../upex-bunkai-tms/.context/business/business-model.md:49`, `../upex-bunkai-tms/.context/SRS/architecture-specs.md:98-124` | Media |
| API-first para operadores AI/CLI | REST + OpenAPI + CLI como superficie operativa | `../upex-bunkai-tms/.context/business/business-model.md:50`, `../upex-bunkai-tms/.context/PRD/executive-summary.md:34` | Alta |

### 3. Channels

| Canal | Found in | Confianza |
|---|---|---|
| GitHub/open-source distribution | `../upex-bunkai-tms/.context/business/business-model.md:54-60` | Alta |
| Contenido, demos y comunidad | `../upex-bunkai-tms/.context/business/business-model.md:56-60` | Alta |
| Conferencias y podcasts QA/DevOps | `../upex-bunkai-tms/.context/business/business-model.md:58` | Media |
| UPEX Galaxy / formación Agentic Quality Engineering | `../upex-bunkai-tms/.context/business/business-model.md:59` | Alta |
| Landing Cloud | `../upex-bunkai-tms/.context/business/business-model.md:60` | Media |

### 4. Customer Relationships

| Relación | Found in | Confianza |
|---|---|---|
| Self-service para Community | `../upex-bunkai-tms/.context/business/business-model.md:62-67` | Alta |
| Soporte comunitario vía GitHub/Discord | `../upex-bunkai-tms/.context/business/business-model.md:64-66` | Media |
| SLA paid support para Cloud/Enterprise | `../upex-bunkai-tms/.context/business/business-model.md:66` | Media |
| Co-creación con primeros design partners | `../upex-bunkai-tms/.context/business/business-model.md:67` | Media |

### 5. Revenue Streams

| Tier | Modelo | Found in | Confianza |
|---|---|---|---|
| Bunkai Community | Self-hosted gratis, open-source | `../upex-bunkai-tms/.context/business/business-model.md:69-79` | Alta |
| Bunkai Cloud | Suscripción mensual por seat; precio objetivo pendiente | `../upex-bunkai-tms/.context/business/business-model.md:73-77` | Media |
| Bunkai Enterprise | Licencia anual con SSO/SAML/audit/support | `../upex-bunkai-tms/.context/business/business-model.md:75-79` | Media |
| Marketplace futuro | Integraciones, ATC packs y dashboards post-PMF | `../upex-bunkai-tms/.context/business/business-model.md:79` | Baja |

### 6. Key Resources

| Recurso | Found in | Confianza |
|---|---|---|
| Codebase open-source | `../upex-bunkai-tms/.context/business/business-model.md:81-86` | Alta |
| Reputación QA del fundador/UPEX Galaxy | `../upex-bunkai-tms/.context/business/business-model.md:83-86` | Media |
| Metodología agentic-qa-boilerplate/KATA/IQL | `../upex-bunkai-tms/.context/business/business-model.md:84-85` | Alta |
| Marca y dominios Bunkai | `../upex-bunkai-tms/.context/business/business-model.md:86` | Media |

### 7. Key Activities

| Actividad | Found in | Confianza |
|---|---|---|
| Construir y mantener core open-source | `../upex-bunkai-tms/.context/business/business-model.md:88-94` | Alta |
| Operar Bunkai Cloud | `../upex-bunkai-tms/.context/business/business-model.md:90-92` | Media |
| Documentación, ejemplos y tutoriales | `../upex-bunkai-tms/.context/business/business-model.md:91-93` | Alta |
| Comunidad y contenido | `../upex-bunkai-tms/.context/business/business-model.md:93-94` | Media |

### 8. Key Partners

| Partner / ecosistema | Found in | Confianza |
|---|---|---|
| Vercel + Supabase | `../upex-bunkai-tms/.context/business/business-model.md:96-103`, `../upex-bunkai-tms/.agents/project.yaml:26-28` | Alta |
| Jira / Atlassian | `../upex-bunkai-tms/.context/business/business-model.md:101-102`, `../upex-bunkai-tms/.agents/project.yaml:29-32` | Alta |
| Playwright/Cypress/Jest/JUnit ecosystem | `../upex-bunkai-tms/.context/business/business-model.md:101` | Media |
| UPEX Quality LLC | `../upex-bunkai-tms/.context/business/business-model.md:102-103` | Media |

### 9. Cost Structure

| Costo | Found in | Confianza |
|---|---|---|
| Tiempo de ingeniería | `../upex-bunkai-tms/.context/business/business-model.md:105-112` | Alta |
| Infra cloud: Vercel, Supabase, Upstash, R2 | `../upex-bunkai-tms/.context/business/business-model.md:107-110` | Media |
| Dominios y marca | `../upex-bunkai-tms/.context/business/business-model.md:108-112` | Media |
| Legal/licenciamiento | `../upex-bunkai-tms/.context/business/business-model.md:111-112` | Media |

## QA Relevance

| Aspecto de negocio | Implicación QA |
|---|---|
| Trazabilidad estructural | Tests deben validar integridad US → AC → ATC → Test → Run → Bug, no solo CRUD feliz. |
| ATCs reutilizables | Riesgo principal: cambios en ATC deben propagarse sin romper Tests existentes ni histórico de Runs. |
| Multi-tenant Workspace/Project | QA debe cubrir aislamiento por workspace, roles y RLS. |
| API-first/agentic | Validar OpenAPI, PAT auth, idempotency y comportamiento CLI/API además de UI. |
| Self-hosted futuro | Separar pruebas Cloud-MVP de supuestos Community/Enterprise aún no implementados. |
| Regulated industries | Seguridad, auditoría, ownership de datos y no fuga cross-tenant son riesgos de release. |

## Discovery Gaps

- [ ] Pricing final de Cloud y Enterprise sigue pendiente.
- [ ] Licencia open-source final no está cerrada.
- [ ] CI/CD real no fue verificado en `.github/workflows/`.
- [ ] Observabilidad Sentry/PostHog está documentada, pero no verificada como implementación activa.
- [ ] Self-hosted Docker Compose está planificado para Phase 2; no debe tratarse como feature disponible en MVP.
- [ ] Esquema/implementación de Bugs requiere reconfirmación contra migraciones actuales antes de automatizar pruebas profundas.

## Sources Used

- `../upex-bunkai-tms/.context/business/business-model.md`
- `../upex-bunkai-tms/.context/business/domain-glossary.md`
- `../upex-bunkai-tms/.context/PRD/executive-summary.md`
- `../upex-bunkai-tms/.context/SRS/architecture-specs.md`
- `../upex-bunkai-tms/.agents/project.yaml`
- `../upex-bunkai-tms/package.json`
