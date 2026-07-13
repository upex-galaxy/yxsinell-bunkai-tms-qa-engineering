# Business API Map — Bunkai

> Discovery date: 2026-07-13
> Last verified against OpenAPI on 2026-07-13
> Target repo: `../upex-bunkai-tms`
> Source level: OpenAPI file, Next.js route handlers, API middleware, Supabase migrations, existing business context. Live DB and external dashboards were not queried.

## 1. Executive Summary

Bunkai's API lets a QA team operate the full traceability chain from requirements to executable evidence: authenticate, enter a workspace, create project structure, author Stories and Acceptance Criteria, write reusable ATCs, compose Tests, and start Runs that snapshot execution state. The API is not a separate back-office surface; it is the same business substrate used by the web app and by headless AI/CLI clients.

The most important design choice is cookie/PAT parity. Browser users authenticate through Supabase session cookies, while agents and CLI clients authenticate with `bk_pat_*` Bearer tokens. Both routes collapse into one `Principal`, then access data through Supabase clients where Postgres RLS remains the main authorization boundary.

For QA, the API risk is concentrated around tenant isolation, capability scopes, idempotency, and snapshot integrity. A failure here does not merely break one endpoint; it can corrupt the product's central promise: QA evidence remains connected to business intent and stable across later edits.

## 2. Permission And Auth Model

| Tier | Who it applies to | How to acquire | Where enforced |
|---|---|---|---|
| Public | Anonymous users, health checks, API discovery | No credential | Explicit `auth: 'public'` in `withApiHandler`; route opt-out in `../upex-bunkai-tms/lib/api/handler.ts` |
| Browser session | Authenticated UI users | Supabase login/signup/OTP/magic-link flow | `../upex-bunkai-tms/middleware.ts`, `../upex-bunkai-tms/lib/api/principal.ts`, Supabase SSR client |
| Bearer PAT | CLI / AI agents / API clients | `POST /api/v1/tokens`, or auth bootstrap endpoints where allowed | `../upex-bunkai-tms/lib/api/middleware/bearer.ts`, `../upex-bunkai-tms/lib/api/principal.ts` |
| Capability-scoped PAT | Headless clients constrained to `atc:read`, `atc:write`, `run:execute`, `workspace:admin` | Token scopes at issuance time | `requireCapability()` in `../upex-bunkai-tms/lib/api/principal.ts`; `requires` option in route handlers |
| Workspace-admin scope | Workspace owner/admin operations such as invites | Browser session role gate, or workspace-scoped PAT with `workspace:admin` | `assertWorkspaceContext()` and membership checks in workspace routes |
| Data access / tenant isolation | Every authenticated caller | RLS-scoped Supabase client as resolved user | Supabase RLS migrations plus `principal.db` in `../upex-bunkai-tms/lib/api/principal.ts` |

### Browser Session Flow

```text
User -> /login -> Supabase Auth -> session cookie
     -> Next middleware refreshes session
     -> API route withApiHandler(auth required)
     -> resolveIdentity(cookie)
     -> Principal(via=cookie, all capabilities)
     -> Supabase SSR client -> Postgres RLS -> response
```

### Bearer PAT Flow

```text
Client -> POST /api/v1/tokens -> receives bk_pat_<prefix>.<secret> once
      -> Authorization: Bearer bk_pat_...
      -> withApiHandler(auth required)
      -> requireBearerToken(prefix lookup + hash compare)
      -> Principal(via=bearer, scoped capabilities)
      -> user-impersonating Supabase client -> Postgres RLS -> response
```

### Enforcement Notes

- API routes are secure by default: `withApiHandler()` requires auth unless a route explicitly sets `auth: 'public'`.
- Cookie callers receive all API capabilities, but route and RLS checks still gate data access.
- PAT callers receive only stored token scopes; `workspace:admin` requires explicit workspace binding.
- Raw PAT secrets are returned once and stored only as hashes in a sibling secret table.
- Bearer validation intentionally collapses malformed, missing, revoked, expired and mismatched tokens into uniform unauthorized responses.

## 3. Critical Business Journeys

### Journey 1 — Login And Workspace Entry

Business purpose: let a user enter Bunkai and land inside the correct workspace context before touching tenant-scoped QA data.

```text
Client -> Public auth route -> Supabase Auth -> session/PAT response
       -> middleware refresh/check -> active workspace route -> workspace cookie
       -> protected app/API calls -> RLS-scoped response
```

1. Client starts with public auth endpoints because no identity exists yet.
2. Supabase Auth validates email/password, OTP or magic-link/OAuth state.
3. Browser traffic stores a session cookie; headless bootstrap may receive PAT-like access for API usage.
4. `middleware.ts` protects `/projects` and `/onboarding`, preserving `next` redirect intent.
5. `POST /api/v1/me/active-workspace` stores workspace context so later UI/API operations resolve tenant scope consistently.

**Endpoints involved:** `POST /api/v1/auth/check-email`, `POST /api/v1/auth/signin`, `POST /api/v1/auth/signup`, `POST /api/v1/auth/confirm`, `POST /api/v1/auth/magic-link`, `GET /api/v1/me`, `POST /api/v1/me/active-workspace`.

**Entities touched:** Workspace, WorkspaceMember, AccessToken.

**Feature IDs:** FEAT-AUTH-001, FEAT-WS-001, FEAT-PAT-001.

### Journey 2 — Workspace Invitation And Membership Control

Business purpose: let workspace admins grow a tenant safely without leaking membership data or allowing non-admin invite issuance.

```text
Admin client -> withApiHandler(requires workspace:admin)
             -> assertWorkspaceContext + membership role check
             -> admin uniqueness probes -> workspace_invites + secret hash
             -> accept URL returned once -> invited user accepts -> WorkspaceMember active
```

1. Admin/owner calls invite endpoints with browser session or workspace-scoped admin PAT.
2. API checks PAT workspace binding before any admin-client uniqueness probes to avoid information leakage.
3. Handler verifies active membership role is `admin` or `owner`.
4. Invite row is created and raw token is returned once; token hash is stored separately.
5. Invited user accepts through `POST /api/v1/invites/accept`, which activates membership.

**Endpoints involved:** `GET /api/v1/workspaces/{id}/invites`, `POST /api/v1/workspaces/{id}/invites`, `POST /api/v1/workspaces/{id}/invites/{inviteId}`, `DELETE /api/v1/workspaces/{id}/invites/{inviteId}`, `POST /api/v1/invites/accept`.

**Entities touched:** Workspace, WorkspaceMember, WorkspaceInvite, ActivityLog.

**Feature IDs:** FEAT-WS-002, FEAT-GOV-001.

### Journey 3 — Requirement Structure Authoring

Business purpose: turn product structure into testable requirement context before ATCs exist.

```text
Client -> authenticated route -> RLS-scoped Supabase client
       -> Project/Module/Story/AC handlers
       -> Postgres constraints + RLS policies
       -> updated workbench response
```

1. Workspace member creates Project and Module structure.
2. Module operations enforce tree constraints such as max depth, move safety, and archive semantics.
3. Story endpoints attach business requirements to a Module.
4. AC endpoints create and reorder testable criteria under a Story.
5. Ready-to-test and ordering rules keep downstream ATC anchoring stable.

**Endpoints involved:** `POST /api/v1/workspaces/{id}/projects`, `POST /api/v1/projects/{id}/modules`, `PATCH /api/v1/modules/{id}`, `DELETE /api/v1/modules/{id}`, `GET/POST /api/v1/modules/{id}/user-stories`, `GET/PATCH/DELETE /api/v1/user-stories/{id}`, `GET/POST /api/v1/user-stories/{id}/acceptance-criteria`, `GET/PATCH/DELETE /api/v1/acceptance-criteria/{id}`.

**Entities touched:** Project, Module, UserStory, AcceptanceCriterion.

**Feature IDs:** FEAT-PROJ-001, FEAT-MOD-001, FEAT-STORY-001, FEAT-AC-001.

### Journey 4 — ATC Authoring And Reuse

Business purpose: create reusable test assets that stay anchored to User Story and Acceptance Criteria instead of becoming disconnected documents.

```text
Client/PAT -> withApiHandler(requires atc:write/read)
           -> validation + sanitization
           -> SECURITY DEFINER RPC / search RPC
           -> atcs + steps + assertions + AC links
           -> usage/search response
```

1. Caller must hold `atc:write` to create or modify ATCs, or `atc:read` to search/inspect usage.
2. API validates JSON shape, step positions, layer, tags and assertion structure before persistence.
3. `createAtc` RPC derives project from the Story, validates cross-entity rules, creates immutable slug and writes child records transactionally.
4. Search and usage endpoints expose reusable asset discovery without leaking cross-workspace data.
5. Duplicate and edit flows support reuse while keeping original ATC identity explicit.

**Endpoints involved:** `POST /api/v1/atcs`, `PATCH /api/v1/atcs/{id}`, `GET /api/v1/atcs/search`, `POST /api/v1/atcs/{id}/duplicate`, `GET /api/v1/atcs/{id}/usage`.

**Entities touched:** ATC, ATCStep, ATCAssertion, ATC_AcceptanceCriteria, UserStory, AcceptanceCriterion, TestStep.

**Feature IDs:** FEAT-ATC-001, FEAT-ATC-002, FEAT-GOV-001.

### Journey 5 — Test Chain Creation And Run Snapshot

Business purpose: compose reusable ATCs into executable Tests, then start Runs that preserve historical evidence even if ATCs change later.

```text
Client/PAT -> POST /tests with Idempotency-Key
           -> createTest RPC -> tests + ordered test_steps
           -> POST /runs with Idempotency-Key + start_token
           -> createRun RPC -> run_atcs/run_steps snapshots
           -> finish/abort terminal state
```

1. `POST /api/v1/tests` requires `atc:write`, workspace binding, and `Idempotency-Key` to prevent duplicate chained Tests on retries.
2. `createTest` RPC owns rulebook: membership, title rules, minimum chain length, same-workspace ATC resolution, and activity log.
3. `POST /api/v1/runs` requires `run:execute`, environment selection, request idempotency, and domain `start_token` for 24-hour replay semantics.
4. `createRun` snapshots Test, ATCs and steps into Run tables so execution evidence survives later source edits.
5. Abort and finish endpoints are terminal actions; race handling here is release-critical.

**Endpoints involved:** `GET/POST /api/v1/tests`, `GET /api/v1/tests/{id}`, `PATCH /api/v1/tests/{id}/reorder`, `PUT /api/v1/tests/{id}/tags`, `POST /api/v1/runs`, `GET /api/v1/runs/{id}`, `POST /api/v1/runs/{id}/abort`, `POST /api/v1/runs/{id}/finish`.

**Entities touched:** Test, TestStep, TestTag, ProjectEnvironment, Run, RunATC, RunStep, ActivityLog.

**Feature IDs:** FEAT-TEST-001, FEAT-TEST-002, FEAT-RUN-001.

### Journey 6 — Jira Import Into Bunkai Structure

Business purpose: ingest external Jira requirements into Bunkai's structured traceability model without duplicate concurrent imports.

```text
Client -> POST /imports -> RLS project lookup
       -> import_jobs queued row + one-active guard
       -> Vercel after() background worker
       -> Jira API pages -> Modules/Stories/AC upsert
       -> GET /imports/{id} polling response
```

1. User submits project id and JQL to `POST /api/v1/imports`.
2. RLS-scoped project lookup prevents outsiders from discovering inaccessible projects.
3. API checks one active import per project before inserting queued job.
4. Database unique constraint protects the race where two imports start together.
5. `after()` runs `runImportJob()` after the 202 response, then client polls status.

**Endpoints involved:** `POST /api/v1/imports`, `GET /api/v1/imports/{id}`.

**Entities touched:** ImportJob, Project, Module, UserStory, AcceptanceCriterion.

**Feature IDs:** FEAT-IMPORT-001, FEAT-GOV-001.

## 4. Architecture Behind The API

```text
Browser / CLI / AI agent
        |
        v
Next.js App Router route handlers (/app/api/v1)
        |
        v
withApiHandler: request-id, logging, errors, auth, capability checks
        |
        +--> Public auth/docs handlers
        |
        +--> RLS-scoped Supabase client as user
        |
        +--> Admin client for safe service-role operations after explicit auth checks
        |
        v
Supabase Postgres: RLS policies, SECURITY DEFINER RPCs, migrations
        |
        +--> Supabase Auth
        +--> Jira API via background import worker
        +--> Optional Resend invite email path (not runtime-verified)
```

| Component | Role | Persistence / Integrations Touched | Why It Matters For QA |
|---|---|---|---|
| Next.js route handlers | API boundary and request parsing | Supabase, Jira worker, OpenAPI docs | Handler options decide public vs protected surface. |
| `withApiHandler` | Central gateway for auth, request id, logging and error envelope | All `/api/v1` routes | Secure-by-default behavior must remain intact across new routes. |
| `resolveIdentity` / `Principal` | Unifies cookie and PAT callers | Supabase SSR client, PAT verifier, user JWT minting | Prevents route-by-route auth drift; parity is core risk. |
| Supabase RLS client | User-scoped data access | Postgres tables under tenant policies | Main tenant isolation boundary. |
| Admin client | Service-role operations after explicit checks | Secret hash tables, RPC calls, admin probes | Must never be used before authorization checks that avoid data leaks. |
| SECURITY DEFINER RPCs | Domain rulebook for complex writes | ATC/Test/Run creation, search/reorder operations | Critical invariants live in DB, not just TypeScript. |
| Idempotency helper | Retry safety for high-impact writes | Idempotency records and response snapshots | Prevents duplicate Tests/Runs from network retries. |
| Vercel `after()` worker | Async import execution | Jira API, import_jobs | Import can succeed/fail after initial 202; polling must be tested. |
| OpenAPI generation/docs | Technical contract exposure | `public/openapi.json`, Scalar docs | Full endpoint shapes belong there, not in this narrative doc. |

## 5. External Integrations

| Service | Trigger | Direction | Failure Mode (User-Visible) | Journeys Affected |
|---|---|---|---|---|
| Supabase Auth | Login/signup/OTP/magic-link/OAuth flows | Outbound SDK / hosted auth | User cannot authenticate; protected pages redirect to login or API returns unauthorized | Login And Workspace Entry |
| Supabase Postgres/RLS | Every authenticated data call | Outbound DB | 403/not found for inaccessible data; 500 if DB/RLS helper fails unexpectedly | All authenticated journeys |
| Supabase JWT signing | Bearer PAT request impersonation | Internal crypto/config dependency | PAT calls fail with internal error if `SUPABASE_JWT_SECRET` missing | ATC, Test, Run, workspace admin via PAT |
| Jira / Atlassian | `POST /api/v1/imports` background job | Outbound async | Import remains failed/errored; Stories/ACs not created or partially imported | Jira Import Into Bunkai Structure |
| Resend | Planned invite email delivery | Outbound async, not verified active | Inviter must copy accept URL manually; email may not arrive if later wired incorrectly | Workspace Invitation And Membership Control |
| Scalar | `/api/docs` | Local UI package | API docs fail to render, but core API still works | API discovery and QA onboarding |
| Vercel runtime | Route handlers and `after()` worker | Deployment/runtime | Background import may not continue or logs may be unavailable | Jira Import Into Bunkai Structure |

## 6. Cross-References

### Data-Map Entities Exposed By The API

| Entity | API Role | Data Map Reference |
|---|---|---|
| Workspace | Tenant boundary and active context | `.context/business/business-data-map.md` §Entity Map |
| WorkspaceMember | Role and access control | `.context/business/business-data-map.md` §Entity Map |
| WorkspaceInvite | Pending membership invitation | `.context/business/business-data-map.md` §Entity Map |
| Project | System under test container | `.context/business/business-data-map.md` §Entity Map |
| Module | Functional tree node | `.context/business/business-data-map.md` §Entity Map |
| UserStory | Business requirement | `.context/business/business-data-map.md` §Entity Map |
| AcceptanceCriterion | Testable acceptance target | `.context/business/business-data-map.md` §Entity Map |
| ATC / ATCStep / ATCAssertion | Reusable test asset | `.context/business/business-data-map.md` §Entity Map |
| Test / TestStep / TestTag | Ordered chain of ATCs | `.context/business/business-data-map.md` §Entity Map |
| ProjectEnvironment | Run target environment | `.context/business/business-data-map.md` §Entity Map |
| Run / RunATC / RunStep | Execution evidence and snapshots | `.context/business/business-data-map.md` §Entity Map |
| AccessToken | Headless API credential | `.context/business/business-data-map.md` §Entity Map |
| ImportJob | Async Jira import state | `.context/business/business-data-map.md` §Entity Map |
| ActivityLog | Audit trail | `.context/business/business-data-map.md` §Entity Map |

### Feature-Map Features Backed By The API

| Feature ID | API Relationship | Feature Map Reference |
|---|---|---|
| FEAT-AUTH-001 | Public auth and session/PAT bootstrap endpoints | `.context/business/business-feature-map.md` §Auth And Workspace |
| FEAT-WS-001 | Workspace creation, listing and active workspace selection | `.context/business/business-feature-map.md` §Auth And Workspace |
| FEAT-WS-002 | Invite issuance, revocation, rotation and acceptance | `.context/business/business-feature-map.md` §Auth And Workspace |
| FEAT-PROJ-001 / FEAT-MOD-001 / FEAT-PROJ-002 | Project and module workbench APIs | `.context/business/business-feature-map.md` §Project And Module |
| FEAT-STORY-001 / FEAT-AC-001 | Requirement authoring APIs | `.context/business/business-feature-map.md` §User Stories And Acceptance Criteria |
| FEAT-ATC-001 / FEAT-ATC-002 | ATC authoring, search, duplicate and usage APIs | `.context/business/business-feature-map.md` §ATCs |
| FEAT-TEST-001 / FEAT-TEST-002 | Test chain, tags and reorder APIs | `.context/business/business-feature-map.md` §Tests |
| FEAT-RUN-001 | Run creation, read, abort and finish APIs | `.context/business/business-feature-map.md` §Runs |
| FEAT-IMPORT-001 | Jira import enqueue/poll APIs | `.context/business/business-feature-map.md` §Imports, API And Tokens |
| FEAT-API-001 | Discovery, health, OpenAPI and docs surfaces | `.context/business/business-feature-map.md` §Imports, API And Tokens |
| FEAT-PAT-001 | PAT list/issue/revoke and scope enforcement | `.context/business/business-feature-map.md` §Imports, API And Tokens |
| FEAT-GOV-001 | Cross-cutting RLS/RBAC/audit/idempotency model | `.context/business/business-feature-map.md` §Imports, API And Tokens |

### Technical API Artifacts

- OpenAPI spec: `../upex-bunkai-tms/public/openapi.json`
- API docs UI: `../upex-bunkai-tms/app/api/docs/page.tsx`
- QA helper UI: `../upex-bunkai-tms/app/qa/page.tsx`
- API sync script in target repo: `bun run api:sync`
- Generated TypeScript schemas in QA repo: `api/schemas/`
- Exhaustive endpoint inventory: `.context/business/business-feature-map.md` §4, and OpenAPI spec above.

## 7. Discovery Gaps

- Live DB was not queried; RLS behavior was inferred from migrations, route comments and tests.
- OpenAPI file was located, but this pass did not validate every route implementation against every OpenAPI operation one by one.
- OAuth provider runtime configuration for Google/GitHub was not verified in Supabase dashboard.
- Jira external credentials and live import behavior were not executed; import flow is mapped from code.
- Resend appears configured/planned, but invite route currently returns/logs accept URL; transactional delivery was not runtime-verified.
- External dashboards/webhooks were not inspected, so inbound webhook capability may exist outside code or be planned only.
- Step-level Run execution remains partial from available evidence; snapshot/start/finish/abort flows are mapped, granular step evidence is a gap.
- `api/schemas/` exists in this QA repo, but current generated coverage appears narrow (`auth.types.ts`, `example.types.ts`) compared with full target OpenAPI surface.
