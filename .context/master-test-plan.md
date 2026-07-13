# Master Test Plan — Bunkai

```text
+------------------------------------------------------------------+
| Bunkai — Master Test Plan                                        |
|                                                                  |
| What to test in this system, and why it matters.                 |
+------------------------------------------------------------------+
```

> Generated: 2026-07-13
> Inputs: `.context/business/business-data-map.md`, `.context/business/business-feature-map.md`, `.context/business/business-api-map.md`
> Scope: business-derived test strategy. Detailed test cases belong in TMS via `/test-documentation`.

## 1. Executive Risk Map

Bunkai's release risk is not simple CRUD. The product promise depends on a connected graph: Workspace -> Project -> Module -> Story -> AC -> ATC -> Test -> Run. If any link breaks, the user loses trust in the evidence chain, even if individual screens still load.

Test this product like a traceability system, not like a form collection. Your first priority is proving tenant isolation, auth parity, ATC anchoring, Test composition, and Run snapshot integrity. Jira import and workspace invitations are also high-risk because they cross external or privileged boundaries.

| Priority | Flow | Why it matters | Depends on / Affects |
|---|---|---|---|
| CRITICAL | Workspace isolation, auth and PAT access | Data leak or privilege escalation breaks trust across every tenant. | Affects every protected flow, API client, and admin action. |
| CRITICAL | Run Lifecycle | Run evidence is the historical truth of QA execution; corrupted snapshots destroy audit value. | Depends on Tests, ATCs, Environments; affects reports and future automation. |
| CRITICAL | ATC Authoring And Update Propagation | ATC reuse is Bunkai's core value: one edit must not corrupt dependent Tests or old Runs. | Depends on Stories/ACs; affects Tests, Runs, search and usage. |
| HIGH | Test Chain Creation And Reorder | Broken chains produce invalid regression scenarios even when ATCs are valid. | Depends on ATC catalog; affects Run creation. |
| HIGH | Workspace Membership And Invitation | Admin-only membership changes can expose or block tenant data. | Depends on auth/RBAC; affects workspace access. |
| HIGH | Jira Import | External requirements can duplicate, overwrite or mis-map Stories/ACs silently. | Depends on Jira, Project/Module model; affects traceability start point. |
| HIGH | Project And Module Navigation | Module tree corruption breaks every downstream requirement and ATC context. | Feeds Story, AC, ATC and workbench navigation. |
| HIGH | User Story And Acceptance Criteria Authoring | ACs are the minimum testing floor; bad ordering or orphaning poisons ATC coverage. | Feeds ATC anchoring and readiness decisions. |

Lower priority but still relevant: API docs/Scalar rendering, command palette stub, design tokens, project update/delete gaps, feature flag table with no exposed management UI.

## 2. What To Test First And Why

### Workspace isolation, auth and PAT access

**Why it matters:** If one workspace can read or mutate another workspace's data, Bunkai fails as a multi-tenant system. If cookie and PAT callers behave differently, AI/CLI automation becomes unsafe even when UI QA passes.

**What commonly breaks:** stale sessions, active workspace cookie mismatch, PAT scopes too broad, `workspace:admin` without workspace binding, admin-client lookups before authorization, and RLS behavior that differs between cookie and bearer paths.

**Dependencies:** Supabase Auth, `withApiHandler`, `resolveIdentity`, RLS helpers, `access_tokens`, workspace membership.

**What an experienced QA would check:**

- Verify anonymous users cannot see `/projects`, workspace data, or protected API data.
- Verify cookie and PAT callers get equivalent allowed behavior for the same user and workspace.
- Verify PATs without `workspace:admin` cannot create/list/revoke invites or perform admin-scoped actions.
- Verify workspace A tokens cannot operate on workspace B, even with valid scopes.
- Verify authorization failures do not reveal whether another workspace, user, invite or token exists.

### Run Lifecycle

**Why it matters:** Runs are execution evidence. A Run must preserve what was executed at that moment, not whatever the current ATC/Test looks like after later edits.

**What commonly breaks:** snapshots mutate after source edits, finish/abort race conditions, duplicate Run creation on retry, missing environment validation, viewer roles mutating execution, and terminal state transitions accepting invalid second actions.

**Dependencies:** Test chain, ProjectEnvironment, ATC snapshots, `run_atcs`, `run_steps`, idempotency, Run abort/finish RPCs.

**What an experienced QA would check:**

- Verify a Run snapshots Test title, ATCs, and steps at creation time.
- Verify editing an ATC after Run creation does not mutate historical Run evidence.
- Verify `finish` and `abort` are distinct terminal transitions and cannot both win.
- Verify missing/foreign Environment or Test data fails safely without leaking cross-workspace details.
- Verify retrying Run creation with the same idempotency/start token returns the correct existing/new behavior.

### ATC Authoring And Update Propagation

**Why it matters:** ATC reuse is the product's differentiator. If an ATC can become orphaned, link to wrong ACs, or update dependents incorrectly, Bunkai becomes another disconnected test-case repository.

**What commonly breaks:** invalid Story/AC anchoring, duplicated or unordered steps, assertion parsing, tag/layer validation, edit propagation to Tests, and archived/deprecated ATC behavior because direct archive/delete is not fully verified.

**Dependencies:** Module, UserStory, AcceptanceCriterion, ATCStep, ATCAssertion, Tests using ATCs, Run snapshots.

**What an experienced QA would check:**

- Verify ATC creation rejects ACs that do not belong to the selected Story.
- Verify step positions must be ordered and stable.
- Verify duplicate/search/usage flows preserve workspace boundaries and ATC identity.
- Verify changing an ATC updates live Test composition but not historical Run snapshots.
- Verify malformed assertions, empty steps and invalid layer/tag combinations fail with useful errors.

### Test Chain Creation And Reorder

**Why it matters:** Tests are ordered chains of reusable ATCs. If order, duplicates or tags break, users execute the wrong scenario while believing coverage is valid.

**What commonly breaks:** duplicate ATCs collapsing into one step, stale optimistic locks, reorder conflicts, cross-workspace ATC inclusion, tag normalization, and missing idempotency keys on create.

**Dependencies:** ATC catalog, `test_steps`, `test_tags`, workspace binding, idempotency.

**What an experienced QA would check:**

- Verify a Test can include the same ATC more than once and preserves distinct step rows.
- Verify reorder handles concurrent/stale state safely.
- Verify tag filtering returns only workspace-visible Tests.
- Verify API retries do not create duplicate Tests.
- Verify invalid, null or foreign ATC ids collapse into safe errors.

### Workspace Membership And Invitation

**Why it matters:** Invites change who can see tenant data. The happy path is easy; the risk is unauthorized issuance, duplicate invites, token leakage, and confusing expired/revoked states.

**What commonly breaks:** role gate checks, active member email uniqueness, one-live-invite rule, expired invite handling, token one-time visibility, and email delivery assumptions.

**Dependencies:** WorkspaceMember, WorkspaceInvite, invite secret hash table, PAT `workspace:admin`, optional Resend path.

**What an experienced QA would check:**

- Verify only admin/owner can invite, resend/rotate and revoke.
- Verify member/viewer cannot infer invite or member state through conflict messages.
- Verify active member emails cannot be invited again.
- Verify expired/revoked invites can be replaced without leaving old tokens usable.
- Verify current MVP behavior returns/logs accept URL because transactional email is not verified.

### Jira Import

**Why it matters:** Import is where external truth enters Bunkai. A broken import can pollute the requirement graph before QA even starts writing ATCs.

**What commonly breaks:** duplicate active jobs, partial failure handling, Jira ADF parsing, AC extraction, project scoping, retry behavior and background worker visibility.

**Dependencies:** Jira credentials, `import_jobs`, Vercel `after()`, Project/Module/Story/AC tables.

**What an experienced QA would check:**

- Verify one active import per project, including race conditions.
- Verify malformed JQL or Jira failures leave a clear failed job state.
- Verify imported Stories and ACs remain traceable to the right Project/Module.
- Verify re-running an import does not duplicate requirements unexpectedly.
- Verify users without project access cannot start or poll imports.

### Project And Module Navigation

**Why it matters:** Modules are the organizing tree for Stories, ACs and ATCs. Tree corruption spreads into every downstream screen.

**What commonly breaks:** moving into descendants, exceeding max depth, soft-deleting subtrees with active content, stale workbench routes, and slug/path resolution under active workspace.

**Dependencies:** Workspace, Project, Module tree, workbench views, Story and ATC context.

**What an experienced QA would check:**

- Verify module max depth 6 and invalid moves are blocked.
- Verify moved modules preserve Stories, ACs and ATCs under the correct project context.
- Verify soft-deleted modules stop appearing where they should, without breaking historical references.
- Verify project slug resolution is workspace-scoped, not global.
- Verify table/tree/mindmap views stay coherent after create/move/archive operations.

### User Story And Acceptance Criteria Authoring

**Why it matters:** Stories and ACs are the floor for test design. If they are unordered, orphaned or incorrectly scoped, ATCs look valid while covering the wrong intent.

**What commonly breaks:** AC order gaps, stale Story updates, Jira key immutability, archived Stories still being selectable, and ready-to-test logic drifting from actual AC state.

**Dependencies:** Module tree, Story uniqueness, AC ordering, ready-to-test gate, ATC anchoring.

**What an experienced QA would check:**

- Verify Stories cannot be created outside visible Modules.
- Verify AC reorder preserves a gap-free sequence.
- Verify archived Stories/ACs do not become invalid ATC anchors unless product explicitly allows it.
- Verify Jira key cannot be accidentally changed after import/manual creation.
- Verify ready-to-test behavior matches AC completeness, not just UI state.

## 3. State Machines That Matter

### Workspace Membership

Membership state controls data visibility. Illegal transitions can either lock valid users out or expose workspace data to users who should no longer have access.

Most fragile transitions: pending invite -> active member, active -> removed/inactive, expired/revoked invite -> replacement invite.

Terminal/forbidden states to guard: revoked invite accepted, expired invite accepted, removed member retaining access, non-admin creating admin invites.

Corruption detection: visible through access checks and member lists, but cross-tenant leakage may only be detected through explicit negative tests.

### ATC Status And Identity

ATC identity matters because Tests reference ATCs, and Runs snapshot them. Even if the exact status enum needs live confirmation, the lifecycle draft/active/deprecated/archived affects reuse and maintenance.

Most fragile transitions: draft -> active, active -> deprecated/archived, active ATC edited while used by Tests, archived/deprecated ATC appearing in new Test selection.

Terminal/forbidden states to guard: orphaned ATC, ATC linked to wrong Story/AC, archived ATC used unexpectedly, historical Runs changing after ATC edits.

Corruption detection: usage view and Run snapshot comparisons should reveal it; without those checks, bad propagation can stay hidden.

### Run Status

Run status has operational impact because it becomes execution evidence. Finish and abort are not cosmetic states; they mean different things to release decisions.

Most fragile transitions: created/in_progress -> passed, created/in_progress -> failed, created/in_progress -> aborted, retrying finish/abort after terminal state.

Terminal/forbidden states to guard: passed -> failed, failed -> passed, aborted -> passed/failed, double finish, finish and abort race.

Corruption detection: Run detail should show final state, but race bugs need API-level/concurrency checks.

### Import Job

Import status controls whether external requirements are trusted as synced. Broken transitions can create partial data that looks complete.

Most fragile transitions: queued -> running, running -> completed, running -> failed, duplicate queued jobs for one project.

Terminal/forbidden states to guard: completed job continuing to mutate data, failed job reported as completed, multiple active jobs for the same project.

Corruption detection: poll `GET /api/v1/imports/{id}`, inspect created Stories/ACs, and verify job counts/errors.

## 4. Silent Killers — Automated Processes

| Process | What it does | What breaks if it misses/runs twice/out of order | Detection Today | Recommended QA Strategy |
|---|---|---|---|---|
| Supabase RLS helpers/policies | Enforce tenant isolation near data | Data leakage, false 404/403, role drift | Tests/code evidence; live DB not queried | Negative cross-workspace probes for every critical entity. |
| ATC create/update RPC | Writes ATC + steps + assertions + AC links transactionally | Orphan ATCs, partial children, bad propagation | API errors and DB state | API integration tests around invalid anchors and propagation. |
| Module move/soft-delete RPC | Maintains module tree integrity | Broken workbench tree, orphan Stories/ATCs, wrong paths | UI may show stale/missing nodes | Tree mutation regression suite with before/after graph assertions. |
| Test reorder RPC | Reorders chained ATCs safely | Wrong execution order or duplicate rows collapsed | UI order may look wrong only after reload | Concurrent reorder and stale-version tests. |
| Run create/read RPC | Creates Run snapshots | Historical evidence mutates or is incomplete | Run detail view/API read | Snapshot immutability tests before/after ATC edits. |
| Run abort/finish RPCs | Enforce terminal execution transitions | Conflicting final evidence | Run final state | Race/retry tests for finish vs abort. |
| Jira import background worker | Fetches Jira and upserts requirements | Partial imports, duplicates, stale requirements | Import poll status and logs | Synthetic import job with controlled Jira fixture or mocked response. |
| Invite token hashing/storage | Keeps raw invite token recoverable only once | Token reuse/leakage or unusable invite | User-visible accept URL once, server logs | Token lifecycle tests: accept, revoke, expire, replay. |

No cron configuration was verified. Treat scheduled maintenance as absent until proven otherwise.

## 5. External Integrations — Failure Points

### Supabase Auth

If Supabase Auth is down or provider config drifts, users cannot enter the product. Auth failure is a hard stop for every protected flow. Acceptable degradation is limited to public docs/health/discovery pages.

Watch for stale session refresh, OAuth provider drift, redirect URL mismatch, OTP/magic-link expiry, and cookie behavior across staging/production domains.

### Supabase Postgres / RLS

This is both persistence and authorization boundary. If RLS is wrong, the app may look functional while leaking or hiding data. There is no acceptable degradation for tenant isolation failures.

Test with at least two workspaces, two users, and different roles. Do not rely on single-user happy paths.

### Jira / Atlassian

Jira import is async and external. If Jira fails, user should see failed import state rather than partial success. If Jira returns unexpected ADF or fields, imported Stories/ACs must fail safely or preserve traceability gaps explicitly.

Sandbox/prod drift matters here: fields and ADF structures often differ between Jira instances.

### Resend

Current evidence says invite email delivery is not runtime-verified and MVP returns/logs accept URLs. Do not test this as a guaranteed email flow yet. Test current behavior honestly: token returned once, URL usable, no assumption that an email arrives.

### Vercel Runtime

Next.js route handlers and `after()` background import depend on runtime behavior. If the worker does not continue after response, imports may stay queued/running. Watch logs and poll status; do not trust the initial 202 as business success.

### Scalar / OpenAPI Docs

Docs failure does not block core business flows, but it blocks API onboarding for QA/AI clients. Treat as medium priority smoke coverage: API docs render, OpenAPI JSON loads, generated schemas stay in sync.

## 6. Dependency Cascade Between Flows

```text
Auth / Session / PAT
    |
    v
Workspace Membership + RLS
    |
    v
Project -> Module -> Story -> Acceptance Criteria
    |
    v
ATC Authoring + Propagation
    |
    v
Test Chain + Reorder
    |
    v
Run Snapshot -> Finish / Abort -> Execution Evidence

Jira Import
    |
    v
Project / Module / Story / Acceptance Criteria
```

Most critical chain: `Auth -> Workspace/RLS -> all protected flows`. If this fails, every later test result is suspect because you may be testing with the wrong tenant or privileges.

Second critical chain: `Story/AC -> ATC -> Test -> Run`. Testing ATC creation alone is not enough; you need to prove downstream Tests use live ATCs correctly and Runs snapshot them immutably.

Third critical chain: `Jira Import -> Story/AC -> ATC`. Import failures can poison the starting requirement data. If AC extraction is wrong, downstream coverage can look complete while validating the wrong criterion.

## 7. Edge Cases Developers Commonly Forget

### Permission Boundaries

- Workspace A user guesses Workspace B ids.
- Viewer tries write APIs through direct HTTP calls.
- PAT has `atc:write` but no `workspace:admin` and attempts invites.
- Browser session and PAT produce different RLS visibility for same user.

### Concurrency And Idempotency

- Two users reorder the same Test at once.
- Same `POST /api/v1/tests` or `POST /api/v1/runs` retried after timeout.
- Run `finish` and `abort` sent close together.
- Two imports start for one project at the same time.

### Orphaned Or Cross-Entity States

- ATC references AC from another Story.
- Story archived while ATCs still depend on it.
- Module moved while open workbench tabs still point to old context.
- Environment deleted or renamed before Run creation.

### Data Limits And Ordering

- Module tree exceeds depth 6.
- AC reorder creates gaps or duplicates.
- ATC steps skip positions or repeat positions.
- Very long Story, AC, ATC title, tags or Jira ADF content.

### Historical Evidence Integrity

- ATC edited after Run creation.
- Test reordered after Run creation.
- Run detail reads live ATC data instead of snapshot rows.
- Failed/aborted Run later appears passed after retry.

### External And Runtime Drift

- OAuth works locally but fails on staging redirect URL.
- Jira fields differ between projects.
- Resend key exists but no actual email path is wired.
- OpenAPI spec drifts from implemented route auth behavior.

## 8. Pre-Release Checklist

1. Verify anonymous users cannot access protected UI routes or protected `/api/v1` data.
2. Verify two workspaces cannot read or mutate each other's Projects, Modules, Stories, ATCs, Tests, Runs or invites.
3. Verify cookie and PAT callers with equivalent identity behave consistently for ATC, Test and Run APIs.
4. Verify `workspace:admin` operations require admin/owner role and workspace-scoped PAT where applicable.
5. Verify ATC creation rejects wrong Story/AC/module relationships.
6. Verify ATC edits propagate to live Test views without mutating existing Run snapshots.
7. Verify Test creation preserves ordered ATC chains, including duplicate ATC references.
8. Verify Test reorder handles stale/concurrent updates safely.
9. Verify Run creation snapshots Test/ATC/steps and remains stable after source edits.
10. Verify Run finish and abort are terminal, mutually exclusive transitions.
11. Verify Jira import allows only one active job per project and reports failed imports clearly.
12. Verify module move/archive preserves tree integrity and downstream Story/ATC context.
13. Verify AC reorder remains gap-free and ready-to-test logic matches acceptance content.
14. Verify invite create/revoke/accept/expire paths enforce role and token rules.
15. Verify OpenAPI docs load and generated schemas are refreshed before API automation work.

## 9. What Is NOT In This Plan

- Flow-level diagrams and state-machine transition tables -> `.context/business/business-data-map.md`
- Feature catalog, CRUD matrix, feature flags -> `.context/business/business-feature-map.md`
- API endpoint inventory / contracts -> `.context/business/business-api-map.md` + `bun run api:sync`
- Detailed test case definitions and traceability -> TMS via `/test-documentation`
- Sprint-level execution order -> `.context/reports/SPRINT-{N}-TESTING.md` via `/sprint-testing`
- KATA automated test implementation details -> `/test-automation`

## 10. Discovery Gaps

- Live DB was not queried; RLS and enum behavior are inferred from migrations, code and context docs.
- Exact enum values for ATC status, Run status, membership status and import status still need live schema or generated type confirmation.
- OAuth provider runtime setup for Google/GitHub was not verified.
- Resend invite email delivery is not verified; current mapped behavior is accept URL returned/logged once.
- Jira live credentials, field mapping and production-like import behavior were not executed.
- Incoming webhooks for Jira/Resend were not verified.
- No cron/scheduler configuration was found.
- Environment isolation across local/staging/production Supabase projects remains unconfirmed.
- `api/schemas/` appears narrower than the target OpenAPI surface and should be refreshed before API automation planning.
