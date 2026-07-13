# Business Data Map — Bunkai

> Discovery date: 2026-07-12
> Target repo: `../upex-bunkai-tms`
> Source level: code, SQL migrations, PRD/SRS/context docs. Live DB was not queried.

```text
+------------------------------------------------------------------+
| Bunkai — Test Management System                                  |
|                                                                  |
| Turns requirements into traceable ATCs, chained Tests, and Runs.  |
| Core value: QA evidence stays connected to business intent.       |
+------------------------------------------------------------------+
```

## Executive Summary

Bunkai models test management as a traceability chain, not a document repository. The central business object is the Acceptance Test Case (`ATC`): it is anchored to a User Story and at least one Acceptance Criterion, reused inside Tests, and snapshotted into Runs so historical execution evidence survives later edits.

The data model is tenant-first: Workspace contains Projects; Projects contain Modules; Modules contain User Stories; Stories contain Acceptance Criteria and ATCs; Tests chain ATCs; Runs snapshot the chain against an Environment. This makes coverage, execution, and later automation auditable from the same graph.

Main actors:

```text
QA Engineer         QA Lead / Owner        AI Agent / CLI
     |                    |                     |
     v                    v                     v
Create ATCs        Manage workspace       Consume API with PAT
Build Tests        Review coverage        Execute/report Runs
Execute Runs       Control access         Sync/import data
```

| Actor | Value Proposition |
|---|---|
| QA Engineer | Less duplicate test writing; every ATC maps to business criteria. |
| QA Lead / Owner | Workspace governance, reusable evidence, and clearer coverage/risk view. |
| Developer Collaborator | Readable requirements/test evidence tied to implementation context. |
| AI Agent / CLI | API-first access through PAT scopes for automated reads/writes/runs. |

## Entity Map

```text
Workspace
  +-- WorkspaceMember
  +-- WorkspaceInvite
  +-- Project
        +-- Module
              +-- UserStory
                    +-- AcceptanceCriterion
                    +-- ATC
                          +-- ATCStep
                          +-- ATCAssertion
                          +-- ATC_AcceptanceCriteria
        +-- ProjectEnvironment

Test
  +-- TestStep -> ATC
  +-- TestTag
  +-- Run
        +-- RunATC snapshot
              +-- RunStep snapshot

AccessToken -> Principal -> Workspace-scoped API access
ImportJob -> Jira data ingestion
ActivityLog -> Auditable domain changes
```

| Entity | Business Role | Why It Exists |
|---|---|---|
| Workspace | Tenant/account boundary | Separates teams and permissions. |
| WorkspaceMember | User membership and role | Drives RBAC and RLS access. |
| WorkspaceInvite | Pending invitation | Lets admins add members without immediate account ownership. |
| Project | Application/system under test | Groups modules, environments, tests, and runs. |
| Module | Functional area/tree node | Mirrors product structure and localizes stories/ATCs. |
| UserStory | Business requirement | Anchors QA to user value. |
| AcceptanceCriterion | Testable condition for a Story | Defines the minimum acceptance floor. |
| ATC | Reusable Acceptance Test Case | Central test asset connected to Story/AC. |
| ATCStep | Ordered executable action | Makes an ATC actionable. |
| ATCAssertion | Expected proof point | Separates action from expected verification. |
| Test | Chain of ATCs | Builds larger regression/manual scenarios from reusable parts. |
| TestStep | Ordered ATC reference inside a Test | Allows reuse and reorder without copying ATC content. |
| TestTag | Test classification | Supports filtering and suite organization. |
| ProjectEnvironment | Target runtime env | Lets Runs execute against local/staging/production-like targets. |
| Run | Execution header | Records one test execution attempt. |
| RunATC | ATC snapshot in a Run | Preserves historical ATC state. |
| RunStep | Step snapshot/result in a Run | Preserves execution evidence per step. |
| AccessToken | PAT credential | Enables headless API/agent access with scopes. |
| ImportJob | Jira import process record | Tracks async import/sync work. |
| ActivityLog | Domain audit trail | Records meaningful user/system actions. |

## Key Relationships

- Workspace membership is the root access rule; most data is scoped through Workspace or Project.
- Project slugs are workspace-scoped, not globally unique.
- Module paths form bounded trees; max depth is 6.
- ATCs must be anchored to a Story and at least one Acceptance Criterion.
- Tests reference ATCs through `test_steps`; they do not copy ATC body.
- Runs snapshot Tests/ATCs/Steps so historical evidence remains stable after source changes.

## Business Flows

### Flow 1 — Login And Workspace Entry

```text
User -> / -> Supabase session check -> /login or /projects -> active workspace
```

1. User opens root route.
2. App checks Supabase session.
3. Anonymous user is redirected to `/login`.
4. Authenticated user is redirected to `/projects`.
5. Protected routes preserve `next` redirect intent.

Business rules:

- Internal routes must not reveal content without a session.
- Stale sessions are refreshed through Supabase SSR middleware.

Code involved:

- `../upex-bunkai-tms/app/page.tsx`
- `../upex-bunkai-tms/middleware.ts`
- `../upex-bunkai-tms/lib/workspaces/active.test.ts`

### Flow 2 — Workspace Membership And Invitation

```text
Owner/Admin -> invite email -> WorkspaceInvite -> user accepts -> WorkspaceMember active
```

1. Admin/owner creates an invite for a workspace.
2. Invite records intended role/status.
3. User accepts through invite route.
4. System creates or activates workspace membership.

Business rules:

- Only authorized workspace roles can manage members.
- Membership status controls access.
- Invites must preserve tenant boundaries.

Code involved:

- `../upex-bunkai-tms/app/invites/accept/page.tsx`
- `../upex-bunkai-tms/app/(app)/workspaces/[id]/members/page.tsx`
- `../upex-bunkai-tms/supabase/migrations/0010_workspace_invites.sql`
- `../upex-bunkai-tms/lib/workspaces/invites.test.ts`

### Flow 3 — Project And Module Navigation

```text
Workspace -> Project -> Module tree -> Workbench table/mindmap/explorer
```

1. User enters project list.
2. User opens a project by slug inside active workspace.
3. App resolves module tree and workbench data.
4. User navigates modules, stories, ATCs, tests, and runs.

Business rules:

- Project slug resolves within active workspace.
- Module tree depth is bounded to 6.
- Soft-deleted/moved modules must not break tree integrity.

Code involved:

- `../upex-bunkai-tms/app/(app)/projects/page.tsx`
- `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/page.tsx`
- `../upex-bunkai-tms/supabase/migrations/0002_projects_modules.sql`
- `../upex-bunkai-tms/supabase/migrations/0014_module_soft_delete.sql`
- `../upex-bunkai-tms/supabase/migrations/0015_module_move.sql`

### Flow 4 — User Story And Acceptance Criteria Authoring

```text
Module -> UserStory -> AcceptanceCriteria -> QA coverage target
```

1. Story is created under a module.
2. Acceptance Criteria are added and ordered.
3. ACs become coverage targets for ATCs.
4. Search/validation prevents invalid authoring states.

Business rules:

- Story belongs to a Module.
- AC belongs to a Story.
- AC order is meaningful and must remain stable.

Code involved:

- `../upex-bunkai-tms/supabase/migrations/0003_authoring.sql`
- `../upex-bunkai-tms/supabase/migrations/0016_user_story_uniqueness.sql`
- `../upex-bunkai-tms/supabase/migrations/0017_acceptance_criteria_ordering.sql`
- `../upex-bunkai-tms/lib/user-stories/validation.test.ts`
- `../upex-bunkai-tms/lib/acceptance-criteria/validation.test.ts`

### Flow 5 — ATC Authoring And Update Propagation

```text
Story + AC -> New ATC -> Steps/Assertions -> Save -> Reuse in Tests
                                  |
                                  v
                            Update propagation rules
```

1. User opens new ATC page within a project.
2. App requires Story/AC/module context.
3. User adds steps, assertions, tags, and layer.
4. Validation prevents orphan or malformed ATCs.
5. ATC can later be reused in one or many Tests.
6. Update propagation governs changes to dependent usage.

Business rules:

- ATC must reference `user_story_id` and at least one AC.
- Step positions are ordered integers.
- Layer is constrained to supported test levels.
- Usage/duplication checks protect reusable assets.

Code involved:

- `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/atcs/new/page.tsx`
- `../upex-bunkai-tms/lib/atcs/validation.ts`
- `../upex-bunkai-tms/supabase/migrations/0004_atcs.sql`
- `../upex-bunkai-tms/supabase/migrations/0021_atc_create_update.sql`
- `../upex-bunkai-tms/supabase/migrations/0035_atc_update_propagation.sql`

### Flow 6 — Test Chain Creation And Reorder

```text
ATC catalog -> pick ATCs -> ordered TestStep chain -> save Test -> reorder if needed
```

1. User creates a Test.
2. User selects ATCs from project/workspace context.
3. System stores ordered `test_steps` references.
4. User may reorder chain.
5. Conflict/validation guards protect stale or invalid chains.

Business rules:

- Test references ATCs; it does not copy ATC content.
- Same ATC may appear more than once; `test_steps.id` identifies the row.
- Foreign/nonexistent/null ATCs collapse into safe errors.

Code involved:

- `../upex-bunkai-tms/components/tests/NewTestBuilder.tsx`
- `../upex-bunkai-tms/components/tests/TestReorderClient.tsx`
- `../upex-bunkai-tms/supabase/migrations/0024_tests.sql`
- `../upex-bunkai-tms/supabase/migrations/0026_tests_reorder.sql`
- `../upex-bunkai-tms/lib/tests/reorder.test.ts`

### Flow 7 — Run Lifecycle

```text
Test + Environment -> Create Run -> Snapshot ATCs/Steps -> Execute -> Finish or Abort
```

1. User starts a Run from a Test and selected Environment.
2. DB/RPC validates workspace/project/environment/test relationships.
3. System creates Run header.
4. System snapshots ATCs and steps into Run-specific rows.
5. User executes and records status/evidence.
6. Run finishes as passed/failed or aborts with reason.

Business rules:

- Creating a Run must snapshot Test title, ATCs, and steps.
- Finish accepts final verdicts; abort is a distinct transition.
- Viewer cannot mutate execution; write roles can.
- Historical Run data must not change when source ATCs change.

Code involved:

- `../upex-bunkai-tms/components/runs/RunnerView.tsx`
- `../upex-bunkai-tms/supabase/migrations/0031_runs.sql`
- `../upex-bunkai-tms/supabase/migrations/0036_run_abort.sql`
- `../upex-bunkai-tms/supabase/migrations/0037_run_finish.sql`
- `../upex-bunkai-tms/lib/runs/start-run.test.ts`

### Flow 8 — PAT/API Agent Access

```text
Agent -> Bearer PAT -> Principal -> Scope check -> RLS-scoped operation
```

1. Machine client sends Bearer PAT.
2. API resolves identity into a `Principal`.
3. Scope checks enforce allowed action.
4. RLS-scoped DB client performs operation.
5. API returns centralized JSON/error envelope.

Business rules:

- Cookie and PAT identities converge into one principal model.
- `workspace:admin` requires workspace and admin/owner role.
- API routes are auth-required by default unless explicitly public.

Code involved:

- `../upex-bunkai-tms/lib/api/handler.ts`
- `../upex-bunkai-tms/lib/api/principal.ts`
- `../upex-bunkai-tms/lib/api/pat.ts`
- `../upex-bunkai-tms/supabase/migrations/0008_access_tokens.sql`

### Flow 9 — Jira Import

```text
Jira config -> ImportJob -> fetch/parse issues -> create/update Bunkai entities
```

1. User or system initiates import.
2. Import job tracks work and active-run protection.
3. Jira ADF/fields are parsed into internal structures.
4. Imported content maps into Bunkai story/AC/test surfaces.

Business rules:

- Only one active import job is allowed where enforced.
- Imported ACs must remain traceable.
- External Jira content must not bypass workspace/project scoping.

Code involved:

- `../upex-bunkai-tms/lib/jira/import-runner.test.ts`
- `../upex-bunkai-tms/lib/jira/adf-to-markdown.test.ts`
- `../upex-bunkai-tms/lib/jira/extract-acceptance-criteria.test.ts`
- `../upex-bunkai-tms/supabase/migrations/0019_import_jobs.sql`
- `../upex-bunkai-tms/supabase/migrations/0020_import_jobs_one_active.sql`

## State Machines

### Workspace Membership

```text
invited/pending -> active -> inactive/removed
```

| From | To | Triggering Event | Effects |
|---|---|---|---|
| Pending invite | Active member | Invite accepted | Grants workspace role access. |
| Active | Removed/inactive | Admin action | Removes or limits workspace access. |

Business rule: membership state and role drive RLS visibility and write capability.

### ATC Status

```text
draft -> active -> deprecated/archived
```

| From | To | Triggering Event | Effects |
|---|---|---|---|
| Draft | Active | ATC completed and saved | ATC can be reused in Tests. |
| Active | Deprecated/Archived | Maintenance decision | Existing Runs retain snapshots; future reuse may be limited. |

Business rule: ATC identity matters because Tests reference ATCs and Runs snapshot them.

### Run Status

```text
created/in_progress -> passed
created/in_progress -> failed
created/in_progress -> aborted
```

| From | To | Triggering Event | Effects |
|---|---|---|---|
| Created/In progress | Passed | Finish with passed verdict | Run becomes terminal success evidence. |
| Created/In progress | Failed | Finish with failed verdict | Run becomes terminal failure evidence. |
| Created/In progress | Aborted | Abort action with reason | Run ends without normal verdict. |

Business rule: finish and abort are different transitions and should be tested separately.

### Import Job

```text
queued -> running -> completed
queued -> running -> failed
```

| From | To | Triggering Event | Effects |
|---|---|---|---|
| Queued | Running | Worker/import starts | Job becomes active. |
| Running | Completed | Import finishes | Imported data available. |
| Running | Failed | Import error | Failure can be reported/retried. |

Business rule: active-job guard prevents concurrent import conflicts.

## Automatic Processes

### DB Functions / RPCs / Triggers

| Process | Type | Why It Exists | Evidence |
|---|---|---|---|
| Workspace/RLS helpers | SQL helpers/policies | Enforce tenant isolation close to data. | `supabase/migrations/0005_rls_helpers.sql` |
| Bootstrap workspace | SQL/RPC | Create initial tenant/member data. | `supabase/migrations/0006_bootstrap_workspace.sql` |
| ATC create/update | SQL/RPC | Centralize validation/persistence of ATC structures. | `supabase/migrations/0021_atc_create_update.sql` |
| Module move/soft delete | SQL/RPC | Preserve tree integrity during hierarchy changes. | `0014_module_soft_delete.sql`, `0015_module_move.sql` |
| Test reorder | SQL/RPC | Reorder chained ATCs safely. | `0026_tests_reorder.sql` |
| ATC search | Search/index process | Fast lookup of reusable ATCs. | `0027_atc_search.sql` |
| Run creation/read JSON | SQL/RPC | Snapshot and return executable run structure. | `0031_runs.sql` |
| Run abort/finish | SQL/RPC | Enforce terminal run transitions. | `0036_run_abort.sql`, `0037_run_finish.sql` |

### Cron Jobs

| Process | Status | Why It Exists |
|---|---|---|
| Scheduled jobs | Not verified | No cron configuration was found in Phase 3. |

### Incoming Webhooks

| Webhook | Status | Why It Exists |
|---|---|---|
| Jira webhook | Not verified | Jira import/sync exists, but inbound webhook route was not confirmed. |
| Supabase Auth callbacks | External OAuth callback configured through Supabase | Handles provider auth handoff outside app-owned OAuth secrets. |
| Resend webhook | Not verified | Resend key exists, but webhook route was not confirmed. |

## External Integrations

### Supabase

```text
Bunkai App/API -> Supabase Auth + Postgres + RLS
```

Purpose: identity, session refresh, database persistence, tenant isolation, and SQL/RPC business operations.

Flows depending on it:

- Login and protected routes.
- Workspace/project/module access.
- ATC/Test/Run persistence.
- PAT principal resolution.

### Jira / Atlassian

```text
Jira -> Import/sync tooling -> Bunkai Stories/ACs/Test context
```

Purpose: import external backlog/test context and keep QA artifacts connected to source work items.

Flows depending on it:

- Jira import.
- PBI sync in QA repo.
- Shift-left and sprint testing handoff.

### Resend

```text
Bunkai -> Resend -> transactional email
```

Purpose: transactional email capability, likely invites or notifications.

Flows depending on it:

- Workspace invite/notification flows, pending confirmation from code path.

### Vercel

```text
Git/Deploy -> Vercel -> Next.js app/API -> Supabase
```

Purpose: inferred hosting platform for staging and production URLs.

Flows depending on it:

- Staging/production QA access.
- API smoke probes.
- Auth redirect URLs.

## Discovery Gaps

- [ ] Live DB was not queried; SQL migrations are treated as source of truth.
- [ ] Exact enum values for ATC status, Run status, membership status, and import status should be confirmed against live schema or generated types.
- [ ] Jira import runtime routes and full field mapping need `/business-api-map` or code-specific follow-up.
- [ ] Resend usage path was inferred from env config; exact email flows need code confirmation.
- [ ] No cron/scheduler configuration was found.
- [ ] Incoming webhook routes were not verified.
- [ ] Environment isolation across local/staging/production Supabase projects remains unconfirmed.
- [ ] API endpoint catalog intentionally not duplicated here; use `bun run api:sync` and `/business-api-map`.
