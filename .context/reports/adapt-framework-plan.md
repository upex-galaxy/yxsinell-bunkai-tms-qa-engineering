# Adapt Framework Plan — Bunkai

> Generated: 2026-07-13
> Project: bunkai-yxsi
> Target repo: `../upex-bunkai-tms`
> Status: IMPLEMENTED WITH BLOCKERS

## 1. Project Summary

This plan adapts the current KATA boilerplate from its generic UPEX Dojo/example state to Bunkai TMS.

| Area | Resolved value | Evidence |
|---|---|---|
| Product | Bunkai TMS — traceability-first Test Management System | `.context/business/business-model.md`, `.context/business/business-data-map.md` |
| Target repo | `../upex-bunkai-tms` | `.agents/project.yaml` |
| Frontend/backend | Next.js app with App Router API routes | `.context/infrastructure/frontend.md`, `.context/infrastructure/backend.md`, target `package.json` |
| Database | Supabase Postgres + RLS + RPCs | `.context/business/business-api-map.md`, target `supabase/migrations/` |
| Auth | Supabase session cookie + Bearer PAT (`bk_pat_*`) | `.context/business/business-api-map.md`, target `public/openapi.json` |
| Default env | `staging` | `.agents/project.yaml` |
| First domain to wire | Auth + Workspace/Project smoke, then ATC API | Risk order from `.context/master-test-plan.md` |
| OpenAPI source | Local target file: `../upex-bunkai-tms/public/openapi.json` | verified file exists |

Strong context files are present: `business-data-map.md`, `business-feature-map.md`, `business-api-map.md`, and `master-test-plan.md`.

## 2. Auth Strategy

### Strategy

Bunkai has hybrid auth, but testing should split the two surfaces clearly:

| Surface | Mechanism | Framework strategy |
|---|---|---|
| UI/E2E | Supabase browser session cookie | `ui-auth.setup.ts` drives `/login`, stores `.auth/user.json` |
| API/integration | Bearer PAT / Supabase access token depending endpoint | `api-auth.setup.ts` and `scripts/api-login.ts` call Bunkai auth endpoints and store `.auth/api-state.json` + `.auth/tokens.env` |
| API docs/schema | OpenAPI without auth execution | OpenAPI MCP stays schema-read-only; authenticated calls use curl token from `.auth/tokens.env` |

### Resolved endpoints

| Purpose | Endpoint | Notes |
|---|---|---|
| Email routing | `POST /api/v1/auth/check-email` | Determines login/signup/verify path. |
| Password sign-in | `POST /api/v1/auth/signin` | OpenAPI exposes `SigninBody` and `SigninResponse`. |
| Signup | `POST /api/v1/auth/signup` | Returns user/session flow; may require OTP verify depending account state. |
| OTP confirm | `POST /api/v1/auth/confirm` | Returns `session.access_token`/`refresh_token`. |
| Magic link | `POST /api/v1/auth/magic-link` | Email-dependent; not primary CI path unless bypass exists. |
| Current user | `GET /api/v1/me` | Replaces template `/auth/me`. |

### Token shape

OpenAPI shows `SigninResponse` includes both `session.access_token` and `pat.token`. KATA API calls must use `pat.token` (`bk_pat_*`) because Bunkai's `/api/v1` Bearer auth validates PATs. UI/browser state uses Supabase session cookies; API setup and `scripts/api-login.ts` must store `body.pat.token`.

### UI login locators

Target login uses stable test ids:

| Step | Test id |
|---|---|
| Email input | `login-email` |
| Continue | `login-continue` |
| Password input | `login-password` |
| Sign in | `login-signin` |
| Error | `login-error` |
| OTP | `login-otp` |
| Verify | `login-verify` |

`LoginPage.ts` must stop using `login-email-input`, `login-password-input`, `login-submit-button`.

### Refresh rule

Default: per-run mint. No auto-refresh exists today. If Bunkai tokens expire quickly in staging, implement a staleness check later; do not claim refresh support until code exists.

## 3. OpenAPI Strategy

Use the target repo's committed OpenAPI file as source:

```bash
bun run api:sync --file ../upex-bunkai-tms/public/openapi.json -t
```

Expected outputs:

- `api/openapi.json`
- `api/openapi-types.ts`
- `api/.openapi-config.json`

Facades to create/update:

| Facade | Source paths/schemas | Purpose |
|---|---|---|
| `api/schemas/auth.types.ts` | `/api/v1/auth/signin`, `/api/v1/auth/check-email`, `/api/v1/me`, `SigninBody`, `SigninResponse`, `ErrorEnvelope` | AuthApi + api-login typing |
| `api/schemas/workspaces.types.ts` | `/api/v1/workspaces`, `/api/v1/me/active-workspace`, invites paths | workspace/bootstrap smoke and invite tests |
| `api/schemas/projects.types.ts` | `/api/v1/workspaces/{id}/projects`, `/api/v1/projects/{id}/modules` | first project/module smoke |
| `api/schemas/atcs.types.ts` | `/api/v1/atcs`, `/api/v1/atcs/search`, `/api/v1/atcs/{id}` | core ATC authoring integration |
| `api/schemas/tests.types.ts` | `/api/v1/tests`, reorder/tags paths | follow-up component after ATC |
| `api/schemas/runs.types.ts` | `/api/v1/runs`, finish/abort paths | high-risk snapshot/terminal tests |

Rules:

- Only `api/schemas/*` imports `@openapi`.
- Components import from `@schemas/<domain>.types`, never from `@openapi`.
- Delete `api/schemas/example.types.ts` when `ExampleApi.ts` is removed.
- Re-export new facades from `api/schemas/index.ts`.

## 4. Identity And Variables

### `.agents/project.yaml`

Already mostly adapted:

| Field | Current | Plan |
|---|---|---|
| `project.project_name` | `bunkai-yxsi` | Keep unless user wants `Bunkai TMS`. |
| `project.project_key` | `BK` | Keep; all new `@atc` decorators use `BK-*`. |
| `project.webapp_domain` | `upexbunkai.vercel.app` | Keep. |
| `backend/frontend repo` | `../upex-bunkai-tms` | Keep. |
| `database.db_type` | `Supabase Postgress` | Fix typo to `Supabase Postgres`. |
| `environments.local` | `http://localhost:3000`, `/api` | Keep. |
| `environments.staging` | `https://staging-upexbunkai.vercel.app`, `/api` | Keep. |
| `qa_epics.*.key` | `null` | Leave; discovered/created later by QA workflows. Not blocker for framework adaptation. |

### `.env` / `.env.example`

Do not print or inspect `.env` secret values. Phase 3 should only ensure required key names exist.

Required keys for this project:

- `TEST_ENV`
- `LOCAL_USER_EMAIL`, `LOCAL_USER_PASSWORD`
- `STAGING_USER_EMAIL`, `STAGING_USER_PASSWORD`
- `API_BASE_URL`
- `OPENAPI_SPEC_PATH`
- `ATLASSIAN_*` if Jira sync is used
- `XRAY_*` only if `AUTO_SYNC=true` and Xray is active
- `DBHUB_*` if DBHub stays enabled
- `TAVILY_API_KEY`, optional `RESEND_API_KEY`, optional `POSTMAN_API_KEY`

### `config/variables.ts`

Update:

| Current | Target |
|---|---|
| staging base `https://dojo.upexgalaxy.com` | `https://staging-upexbunkai.vercel.app` |
| staging api `https://dojo.upexgalaxy.com/api` | `https://staging-upexbunkai.vercel.app/api` |
| auth login `/auth/login` | `/api/v1/auth/signin` relative issue: current `apiUrl` already includes `/api`, so choose either apiUrl root or endpoint carefully to avoid `/api/api/v1` |
| auth me `/auth/me` | `/api/v1/me` with same base-path care |
| token lifetime `86400` | derive from response `session.expires_at` or keep conservative fallback |

Important design choice for Phase 3: avoid double `/api`. Either change `apiUrl` to origin (`https://...`) and endpoints to `/api/v1/...`, or keep `apiUrl` as `https://.../api` and endpoints as `/v1/...`. Prefer origin + full `/api/v1` endpoints because OpenAPI servers use origin URLs.

## 5. Components To Create / Modify

### Keep and adapt

| File | Changes |
|---|---|
| `tests/components/api/AuthApi.ts` | Replace template endpoints/types, use Bunkai `SigninResponse.pat.token`, `GET /api/v1/me`, ATCs `BK-101`, `BK-102`. |
| `tests/components/ui/LoginPage.ts` | Replace locators with Bunkai login step ids, handle email-first flow, success URL `/projects` or `/onboarding`, ATCs `BK-101`, `BK-102`. |
| `tests/setup/api-auth.setup.ts` | Extract nested `pat.token`, write non-empty `.auth/api-state.json`. |
| `tests/setup/ui-auth.setup.ts` | Drive email-first UI login; handle possible onboarding/projects redirect. |
| `scripts/api-login.ts` | Build `{ email, password }`; extract `body.pat.token`, Bearer token type, expiry; populate `.auth/tokens.env`. |
| `tests/data/DataFactory.ts` | Remove hotel/booking data; add Bunkai factories for workspace/project/module/story/AC/ATC payloads as needed. |
| `tests/data/types.ts` | Remove `TestHotel`/`TestBooking`; add Bunkai domain payload types or import facades where practical. |
| `playwright.config.ts` | Remove `testIgnore: ['**/module-example/**']` after deleting example specs. Keep smoke grep `@critical`. |

### Create first real domain components

| Component | Why first | Initial ATCs/helpers |
|---|---|---|
| `tests/components/api/WorkspacesApi.ts` | Auth/RLS/workspace is top critical risk. | helper: `getMe`, ATC: create/list/set active workspace where safe. |
| `tests/components/api/ProjectsApi.ts` | First low-risk smoke after auth; project/module context feeds everything. | ATC: create project; helper: list projects if endpoint exists. |
| `tests/components/api/AtcsApi.ts` | Core business value; after project/story/AC setup exists. | ATC: create ATC successfully; negative ATC for AC outside Story. |
| `tests/components/ui/ProjectsPage.ts` | UI smoke after login; data-testid coverage exists. | ATC: create project via UI or verify projects list loads. |

Phase 6 should build only the first slice, not all components. Recommended first smoke: UI login -> Projects page loads, plus API auth `/me` check. ATC API automation can follow once project/story/AC fixtures are stable.

### Delete generic artifacts

Delete after replacement components exist:

- `tests/components/api/ExampleApi.ts`
- `tests/components/ui/ExamplePage.ts`
- `tests/components/steps/ExampleSteps.ts`
- `api/schemas/example.types.ts`
- `tests/e2e/module-example/`
- `tests/integration/module-example/`
- `tests/data/fixtures/example.json`

### ATC key rewrite

Rewrite decorator lines only:

- `@atc('PROJ-101')` -> `@atc('BK-101')`
- `@atc('PROJ-102')` -> `@atc('BK-102')`

Leave instructional docs/examples outside `tests/components/**` untouched unless `/sync-ai-memory` later handles docs.

## 6. Env Vars And Secrets

### Local `.env` keys to ensure

Do not echo values. Only verify presence:

```text
TEST_ENV
LOCAL_USER_EMAIL
LOCAL_USER_PASSWORD
STAGING_USER_EMAIL
STAGING_USER_PASSWORD
API_BASE_URL
OPENAPI_SPEC_PATH
ATLASSIAN_URL
ATLASSIAN_EMAIL
ATLASSIAN_API_TOKEN
DBHUB_TYPE
DBHUB_HOST
DBHUB_PORT
DBHUB_DATABASE
DBHUB_USER
DBHUB_PASSWORD
```

Recommended Bunkai values for non-secret examples:

```text
API_BASE_URL=https://staging-upexbunkai.vercel.app
OPENAPI_SPEC_PATH=./api/openapi.json
```

### GitHub repo secrets user must set externally

- `LOCAL_USER_EMAIL`, `LOCAL_USER_PASSWORD` if CI runs local env.
- `STAGING_USER_EMAIL`, `STAGING_USER_PASSWORD`.
- `ATLASSIAN_URL`, `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN` if Jira sync runs in CI.
- `XRAY_CLIENT_ID`, `XRAY_CLIENT_SECRET`, `XRAY_PROJECT_KEY` if `AUTO_SYNC=true` with Xray.
- `TAVILY_API_KEY` only if CI invokes web search tooling.
- `POSTMAN_API_KEY`, optional.
- `SLACK_WEBHOOK_URL`, optional.

## 7. CI, MCP And Reporting

### CI

No `.github/workflows/*` files exist in this QA repo at implementation time, so CI reconciliation is a documented gap rather than an applied change.

Required consistency:

- Environment options equal `local | staging` unless production is added to `config/variables.ts`.
- Secret names use `<ENV>_USER_EMAIL` / `<ENV>_USER_PASSWORD`.
- Smoke tests use `@critical`, not `@smoke`.
- Allure paths should use Bunkai report name.

### MCP dual-file sync

Current MCP servers exist in both `.mcp.json` and `opencode.jsonc`: `context7`, `tavily`, `playwright`, `dbhub`, `openapi`, `postman`.

Planned decision:

- Keep `openapi` enabled, schema-read-only.
- Ensure `.env` provides `API_BASE_URL` and `OPENAPI_SPEC_PATH`.
- Keep `dbhub` enabled only if `DBHUB_*` is populated; otherwise disable `dbhub` in both files or mark DBHub unavailable.
- `.agents/project.yaml` currently names `local-dbhub`, `staging-dbhub`, `local-openapi`, `staging-openapi`, but MCP files currently expose single `dbhub` and `openapi`. Phase 3/7 must reconcile this mismatch. Minimal route: change project.yaml env MCP names to `dbhub` / `openapi` for both envs.

### Allure

Rename `allurerc.mjs`:

```text
Agentic QA Boilerplate -> Bunkai QA Engineering
```

## 8. Implementation Phases After Approval

### Phase 3 — Identity + Variables

- [x] Fix `database.db_type` typo.
- [x] Reconcile `project.yaml` MCP names with actual MCP server names.
- [x] Update `config/variables.ts` URLs and auth endpoints without double `/api`.
- [x] Ensure `.env.example` non-secret examples align with Bunkai.
- [x] Do not inspect or print `.env` secret values.

### Phase 4 — OpenAPI + Facades

- [x] Run `bun run api:sync --file ../upex-bunkai-tms/public/openapi.json -t`.
- [x] Replace stub `api/openapi-types.ts`.
- [x] Update auth facade and create first Bunkai facades.
- [x] Delete `example.types.ts` after `ExampleApi.ts` is gone.

### Phase 5 — Auth Wiring

- [x] Adapt `AuthApi.ts`, `LoginPage.ts`, `api-auth.setup.ts`, `ui-auth.setup.ts`, `scripts/api-login.ts`.
- [x] Use `pat.token` for API Bearer auth; keep browser session storage for UI.
- [ ] Verify api setup, UI setup, and `api:login` token file generation. Blocked by missing local credentials in `.env`.

### Phase 6 — First Entity + Smoke

- [x] Keep first slice focused on auth API + login UI smoke.
- [x] Register adapted components in fixtures.
- [x] Remove Example components/specs/data.
- [x] Keep `@critical` smoke coverage on adapted auth tests.

### Phase 7 — CI + Manifest + MCP

- [x] Regenerate `kata-manifest.json`.
- [x] Reconcile workflows: no `.github/workflows/*` files exist.
- [x] Reconcile MCP names through `.agents/project.yaml`; no MCP file edits required.
- [x] Rename Allure report.

### Phase 8 — Validation Gate

Run in order:

```bash
bun run types:check
bun run lint:check
bun run vars:check
bun run vars:env:check
bun run kata:manifest:check
bun run test --project=api-setup
bun run test --project=ui-setup
bun run api:login staging
bun run test:smoke
bun run test:smoke
bun run repo:check
```

Stop on first failure and report. Do not auto-fix beyond approved scope.

Completed static validation:

```bash
bun run repo:check
bun run types:check
bun run lint:check
bun run vars:check
bun run vars:env:check
bun run kata:manifest:check
```

Blocked runtime validation:

```bash
bun run test:env:check
```

Reason: `LOCAL_USER_EMAIL` and `LOCAL_USER_PASSWORD` are required for `TEST_ENV=local` and are not available in the current environment.

### Phase 9 — Genericness Close

- [x] Re-run baseline table.
- [ ] Mark this plan `COMPLETED` only when runtime auth validation passes.
- [ ] Recommend `/sync-ai-memory` for README/CONTEXT/INSTALLER/docs scrub.

## 9. AI Guidelines

- KATA layers stay intact: TestContext -> Base -> Domain Component -> Fixture -> Test.
- Components import from `@schemas/*`, not `@openapi`.
- No relative imports in test components.
- ATCs are complete mini-flows and do not call other ATCs.
- Helpers are undecorated or `@step`; state-changing flows use `@atc`.
- Max two positional params; three or more require object parameter.
- Locators stay inline unless reused in two or more ATCs in the same Page.
- Prefer `data-testid`; Bunkai already exposes many stable ids.
- Credentials come from `.env`; never hardcode or print secrets.
- Smoke tag remains `@critical`.
- Do not delete or edit target repo `../upex-bunkai-tms`; adaptation modifies this QA repo only.

## 10. Questions Answered From Context

| Question | Answer |
|---|---|
| Auth scheme | Hybrid: Supabase cookie for UI, Bearer PAT/session token for API. |
| Login endpoint | `POST /api/v1/auth/signin`. |
| Login payload | `{ email, password }`. |
| Token field | `pat.token` for API Bearer auth; `session.access_token` is Supabase session data. |
| User-info endpoint | `GET /api/v1/me`. |
| Auth header | Standard `Authorization: Bearer <token>` for PAT/token calls. |
| Login route | `/login`. |
| Success route | likely `/projects` or `/onboarding` depending workspace state. |
| data-testid coverage | Present for login, projects, modules, tests, runs and QA pages. |
| Multi-tenant | Workspace-scoped via RLS and active workspace. |
| OpenAPI source | `../upex-bunkai-tms/public/openapi.json`. |
| First entity | Auth/workspace/project smoke first; ATC API next. |
| DB | Supabase Postgres. |
| Allure report name | `Bunkai QA Engineering`. |

## 11. Discovery Gaps

- Exact staging credentials/roles are in `.env`; not inspected or printed.
- Whether staging enforces email verification, 2FA, captcha or rate limits is not verified. If enforced with no bypass, UI auth setup will block.
- Login success route depends on existing workspace state: `/projects` vs `/onboarding` must be asserted flexibly or seeded.
- DBHub credentials and whether DBHub MCP can connect are unverified.
- GitHub Pages / `gh-pages` setup for Allure reports not verified.
- TMS modality appears Xray from config, but whether `AUTO_SYNC` should stay false or turn on is not decided.
- Project production env exists in OpenAPI servers, but current QA config only has `local | staging`; adding production is a separate decision.
- Existing `.context` files have many untracked/dirty changes; do not revert unrelated work.

## 12. Genericness Baseline

| Subsystem | Status | Evidence / next action |
|---|---|---|
| Project config | ADAPTED | `.agents/project.yaml` uses Bunkai env URLs, Supabase Postgres, and actual MCP server names. |
| Context files | ADAPTED | Business maps and master test plan exist. |
| OpenAPI types | ADAPTED | `api/openapi-types.ts` generated from target Bunkai OpenAPI. |
| OpenAPI cache | ADAPTED | `api/openapi.json` synced from `../upex-bunkai-tms/public/openapi.json`. |
| Auth URLs | ADAPTED | `config/variables.ts` uses origin API base and `/api/v1/auth/signin`, `/api/v1/me`. |
| Auth components | ADAPTED | `AuthApi.ts` and `LoginPage.ts` use Bunkai selectors/endpoints and `BK-*` ATCs. |
| Example components | ADAPTED | `ExampleApi.ts`, `ExamplePage.ts`, `ExampleSteps.ts` removed. |
| Example specs | ADAPTED | `tests/e2e/module-example/` and `tests/integration/module-example/` removed. |
| Example domain data | ADAPTED | Hotel/booking/example fixture signals removed from test data. |
| Manifest | ADAPTED | `kata-manifest.json` lists only `AuthApi`, `LoginPage`, and 4 `BK-*` ATCs. |
| Smoke tag | ADAPTED | `playwright.config.ts` smoke grep uses `@critical`. |
| Playwright config | ADAPTED | Removed module-example ignore after deleting example specs. |
| MCP dual-file | ADAPTED | Project config now resolves to `dbhub` and `openapi`. |
| DBHub | PARTIAL | `dbhub.toml` exists; credentials/connectivity unverified. |
| Allure | ADAPTED | `allurerc.mjs` name is `Bunkai QA Engineering`. |
| CI workflows | GAP | No `.github/workflows/*` files exist in this QA repo. |
| CLAUDE.md | PARTIAL | Contains Bunkai context but still needs final adapted auth/entity/OpenAPI notes after implementation. |
| Full gate | PARTIAL | Static validation passed; runtime auth validation blocked by missing local credentials. |

## 13. Approval Checklist

- [x] Approve changing `config/variables.ts` API base strategy to origin URL + full `/api/v1/...` endpoints.
- [x] Approve replacing `PROJ-*` ATC decorators with `BK-*` in kept components.
- [x] Approve deleting generic `Example*`, `module-example`, and example fixture artifacts.
- [x] Approve using target OpenAPI file `../upex-bunkai-tms/public/openapi.json` for `bun run api:sync`.
- [x] Approve first smoke slice: auth API `/me` verification plus UI login smoke.
- [ ] Confirm whether DBHub should stay enabled now or be disabled until DB credentials are ready.
- [ ] Confirm whether TMS sync remains `AUTO_SYNC=false` for initial adaptation.

> Runtime completion waits for valid `.env` credentials, then setup/smoke tests can run.
