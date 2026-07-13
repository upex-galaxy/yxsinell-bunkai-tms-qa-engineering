# Non-Functional Specifications — Bunkai

> Discovery date: 2026-07-12
> Los targets numéricos documentados se tratan como **targets de producto**, no como resultados medidos, salvo que exista evidencia runtime.

## NFR Summary

| Category | Implemented / Verified | Maturity |
|---|---|---|
| Performance | Índices, bounded trees, static OpenAPI, query/RPC patterns verificados; targets no medidos | Medium |
| Security | Auth, RLS, PAT scopes, central error handling verificados | Good |
| Reliability | Request IDs/logging/idempotency parcial verificados; CI/health depth incompleto | Medium |
| Scalability | Stateless Next.js + Postgres indexes; queues/Redis no verificados | Medium |
| Observability | Structured request logging verificado; Sentry/PostHog no verificados en código activo | Basic/Medium |

## 1. Performance

### NFR-PERF-001: Project tree depth bounded

| Aspect | Value |
|---|---|
| **Target** | Module tree depth 1..6 |
| **Implementation** | DB CHECK sobre `modules.path` |
| **Evidence** | `../upex-bunkai-tms/supabase/migrations/0002_projects_modules.sql:118-120` |

Esto limita el costo de recursive CTEs y simplifica testing de tree view.

### NFR-PERF-002: ATC search indexed

| Aspect | Value |
|---|---|
| **Target** | Search por title/tags soportado por índice |
| **Implementation** | `tsvector` + GIN index |
| **Evidence** | `../upex-bunkai-tms/supabase/migrations/0004_atcs.sql:8-10`, `../upex-bunkai-tms/supabase/migrations/0004_atcs.sql:71-75` |

### NFR-PERF-003: OpenAPI static cache

| Aspect | Value |
|---|---|
| **Target** | Servir spec sin auth y con cache corta |
| **Implementation** | `force-static`, `cache-control: public, max-age=300, s-maxage=300` |
| **Evidence** | `../upex-bunkai-tms/app/api/openapi/route.ts:14-24` |

### NFR-PERF-004: Product performance targets

| Aspect | Value |
|---|---|
| **Target** | LCP < 2.0s p75, API reads < 200ms p95, listings < 500ms p95, tree < 800ms p95 según docs |
| **Implementation** | No verificada con telemetry en Phase 2 |
| **Evidence** | `../upex-bunkai-tms/.context/SRS/non-functional-specs.md:8-22` |

Estos son targets de producto; faltan mediciones reales.

## 2. Security

### NFR-SEC-001: Protected routes require session

| Aspect | Value |
|---|---|
| **Target** | `/projects` y `/onboarding` inaccesibles sin auth |
| **Implementation** | Next middleware con Supabase SSR client |
| **Evidence** | `../upex-bunkai-tms/middleware.ts:8-51` |

### NFR-SEC-002: API secure by default

| Aspect | Value |
|---|---|
| **Target** | Route Handler requiere auth salvo opt-out explícito |
| **Implementation** | `withApiHandler` defaults to auth required |
| **Evidence** | `../upex-bunkai-tms/lib/api/handler.ts:40-82` |

### NFR-SEC-003: Cookie/PAT auth parity

| Aspect | Value |
|---|---|
| **Target** | Cookie y Bearer PAT convergen en un `Principal` RLS-scoped |
| **Implementation** | `resolveIdentity`, impersonating client with user JWT |
| **Evidence** | `../upex-bunkai-tms/lib/api/principal.ts:12-25`, `../upex-bunkai-tms/lib/api/principal.ts:45-74`, `../upex-bunkai-tms/lib/api/principal.ts:106-123` |

### NFR-SEC-004: PAT scopes and admin guard

| Aspect | Value |
|---|---|
| **Target** | Scope-limited API access; no global admin token via headless auth |
| **Implementation** | `ALLOWED_PAT_SCOPES`, `assertNoGlobalAdminScope`, `assertTokenIssuanceAuthorized` |
| **Evidence** | `../upex-bunkai-tms/lib/api/pat.ts:12-40`, `../upex-bunkai-tms/lib/api/pat.ts:49-88` |

### NFR-SEC-005: RLS tenant isolation

| Aspect | Value |
|---|---|
| **Target** | Workspace data visible only a active members |
| **Implementation** | Postgres RLS policies over workspace/project/module/story/ATC/test/run tables |
| **Evidence** | `../upex-bunkai-tms/supabase/migrations/0001_tenancy.sql:67-210`, `../upex-bunkai-tms/supabase/migrations/0002_projects_modules.sql:131-212` |

## 3. Reliability

### NFR-REL-001: Request ID and centralized error envelope

| Aspect | Value |
|---|---|
| **Target** | Cada API response recibe `x-request-id`; errores esperados mapeados centralmente |
| **Implementation** | `withApiHandler`, `ApiError`, ZodError mapping |
| **Evidence** | `../upex-bunkai-tms/lib/api/handler.ts:12-25`, `../upex-bunkai-tms/lib/api/handler.ts:83-124` |

### NFR-REL-002: Idempotency-Key middleware

| Aspect | Value |
|---|---|
| **Target** | Evitar writes duplicados/retries peligrosos |
| **Implementation** | `idempotency_keys` lifecycle with request hash and snapshots |
| **Evidence** | `../upex-bunkai-tms/lib/api/idempotency.ts:4-28`, `../upex-bunkai-tms/lib/api/idempotency.ts:59-158` |

### NFR-REL-003: Run snapshot model preserves history

| Aspect | Value |
|---|---|
| **Target** | Cambios futuros en ATC no corrompen Runs históricos |
| **Implementation** | `runs`, `run_atcs`, `run_steps` snapshot tables |
| **Evidence** | `../upex-bunkai-tms/supabase/migrations/0031_runs.sql:7-15`, `../upex-bunkai-tms/supabase/migrations/0031_runs.sql:120-179` |

### NFR-REL-004: Health endpoint

| Aspect | Value |
|---|---|
| **Target** | Health route para smoke/liveness |
| **Implementation** | `app/api/v1/health/route.ts` detectado |
| **Evidence** | `../upex-bunkai-tms/app/api/v1/health/route.ts` |

## 4. Scalability

### NFR-SCALE-001: Stateless API surface

| Aspect | Value |
|---|---|
| **Target** | Route handlers escalables por plataforma serverless |
| **Implementation** | Next.js route handlers; estado en Supabase/Postgres |
| **Evidence** | `../upex-bunkai-tms/app/api/v1/**/*.ts`, `../upex-bunkai-tms/lib/api/handler.ts` |

### NFR-SCALE-002: Workspace-scoped indexes

| Aspect | Value |
|---|---|
| **Target** | Queries frecuentes por workspace/project/test performantes |
| **Implementation** | Índices `workspace_id`, `project_id`, `test_id`, `atc_id` |
| **Evidence** | `../upex-bunkai-tms/supabase/migrations/0001_tenancy.sql:37-54`, `../upex-bunkai-tms/supabase/migrations/0002_projects_modules.sql:27-28`, `../upex-bunkai-tms/supabase/migrations/0031_runs.sql:92-94` |

### NFR-SCALE-003: Async/Jira import

| Aspect | Value |
|---|---|
| **Target** | Importar Jira sin bloquear UI |
| **Implementation** | `imports` routes y `lib/jira/import-runner.ts` detectados |
| **Evidence** | `../upex-bunkai-tms/app/api/v1/imports/route.ts`, `../upex-bunkai-tms/lib/jira/import-runner.ts` |

## 5. Observability

### NFR-OBS-001: Structured request logging

| Aspect | Value |
|---|---|
| **Target** | Logs API con request_id, method, path, status, duration |
| **Implementation** | `logRequest` dentro de `withApiHandler` |
| **Evidence** | `../upex-bunkai-tms/lib/api/handler.ts:85-106` |

### NFR-OBS-002: Sentry/PostHog product target

| Aspect | Value |
|---|---|
| **Target** | Error/product analytics según SRS objetivo |
| **Implementation** | No verificada como código activo en Phase 2 |
| **Evidence** | `../upex-bunkai-tms/.context/SRS/non-functional-specs.md:85-90` |

## Compliance

| Area | Status | Notes |
|---|---|---|
| GDPR | Needs Review | Docs mencionan export/delete; implementación no verificada |
| SOC 2 | Future / Phase 3 | No requerido MVP según docs |
| HIPAA/PCI | Not verified | No evidencia de alcance regulatorio específico |
| Data sovereignty | Product strategy | Self-hosted planificado Phase 2 |

## Discovery Gaps

- [ ] No se ejecutaron pruebas de performance; targets no están medidos.
- [ ] Rate limiting documentado en NFR, pero no verificado en código Phase 2.
- [ ] CSP/HSTS headers no verificados; `next.config.ts` no define headers de seguridad custom.
- [ ] Sentry/PostHog no verificados como implementación activa.
- [ ] CI/CD ausente en repo local.
- [ ] Backup/restore Supabase no verificado.

## QA Relevance

| NFR | Cómo testear |
|---|---|
| Route protection | Playwright E2E anónimo vs autenticado |
| RLS isolation | API/DB tests con usuarios de distintos workspaces |
| PAT scopes | API tests de scope permitido/denegado |
| Idempotency | Repetir `Idempotency-Key` mismo payload/diferente payload/concurrente |
| Run snapshot | Crear Run, editar ATC, verificar histórico intacto |
| OpenAPI cache/drift | Smoke de `/api/openapi` + comparación contra routes críticas |
| Security headers | Revisar headers en staging; posible OWASP ZAP baseline |
