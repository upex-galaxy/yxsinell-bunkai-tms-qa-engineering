# Business Feature Map — Bunkai

> Discovery date: 2026-07-13
> Target repo: `../upex-bunkai-tms`
> Source level: code, SQL migrations, PRD/SRS/context docs, `package.json`. Live DB was not queried.

## 1. Inventory Summary

| Category | Features | Status |
|---|---:|---|
| Core QA model | 8 | Stable / Partial |
| Workspace and governance | 4 | Stable / Partial |
| API and integrations | 4 | Stable / Partial |
| Planned or WIP | 4 | In Development / Planned |

## 2. Feature Catalog

### Auth And Workspace

#### Feature: Login email-first, password, signup, OTP and magic link

| Aspect | Value |
|---|---|
| **ID** | FEAT-AUTH-001 |
| **Status** | Stable |
| **Endpoints** | `POST /api/v1/auth/check-email`, `POST /api/v1/auth/signin`, `POST /api/v1/auth/signup`, `POST /api/v1/auth/confirm`, `POST /api/v1/auth/magic-link` |
| **UI** | `/login` |
| **Users** | Public users |
| **Dependencies** | Supabase Auth, OAuth providers |
| **Evidence** | `../upex-bunkai-tms/app/(auth)/login/email-first-form.tsx`, `../upex-bunkai-tms/app/(auth)/login/magic-link-form.tsx`, `../upex-bunkai-tms/app/(auth)/login/oauth-buttons.tsx`, `../upex-bunkai-tms/app/api/v1/auth/*/route.ts` |

**Capabilities:**

- [x] Detect email login path.
- [x] Sign in with password.
- [x] Create account.
- [x] Confirm OTP.
- [x] Request magic link.
- [x] Expose OAuth buttons for Google/GitHub.

#### Feature: Workspace bootstrap and active workspace

| Aspect | Value |
|---|---|
| **ID** | FEAT-WS-001 |
| **Status** | Stable |
| **Endpoints** | `GET /api/v1/workspaces`, `POST /api/v1/workspaces`, `GET /api/v1/me`, `POST /api/v1/me/active-workspace` |
| **UI** | `/onboarding`, workspace switcher |
| **Users** | Authenticated users |
| **Dependencies** | Supabase session, workspace membership |
| **Evidence** | `../upex-bunkai-tms/app/(app)/onboarding/onboarding-form.tsx`, `../upex-bunkai-tms/components/layout/WorkspaceSwitcher.tsx`, `../upex-bunkai-tms/supabase/migrations/0006_bootstrap_workspace.sql` |

**Capabilities:**

- [x] Create initial workspace.
- [x] Enroll creator as owner.
- [x] List user's workspace memberships.
- [x] Set active workspace for scoped navigation.

#### Feature: Workspace invitations and members

| Aspect | Value |
|---|---|
| **ID** | FEAT-WS-002 |
| **Status** | Partial |
| **Endpoints** | `GET /api/v1/workspaces/{id}/invites`, `POST /api/v1/workspaces/{id}/invites`, `POST /api/v1/workspaces/{id}/invites/{inviteId}`, `DELETE /api/v1/workspaces/{id}/invites/{inviteId}`, `POST /api/v1/invites/accept` |
| **UI** | `/workspaces/[id]/members`, `/invites/accept` |
| **Users** | Workspace owner/admin, invited authenticated user |
| **Dependencies** | Workspace RBAC, invite token flow |
| **Evidence** | `../upex-bunkai-tms/app/(app)/workspaces/[id]/members/members-client.tsx`, `../upex-bunkai-tms/app/invites/accept/accept-client.tsx`, `../upex-bunkai-tms/app/api/v1/workspaces/[id]/invites/route.openapi.ts` |

**Capabilities:**

- [x] Create invite.
- [x] Rotate/resend invite token.
- [x] Revoke invite.
- [x] Accept invite.
- [ ] Confirm transactional email delivery in runtime.

### Project And Module

#### Feature: Project list and creation

| Aspect | Value |
|---|---|
| **ID** | FEAT-PROJ-001 |
| **Status** | Stable |
| **Endpoints** | `POST /api/v1/workspaces/{id}/projects` |
| **UI** | `/projects` |
| **Users** | Workspace members |
| **Dependencies** | Workspace membership, project slug uniqueness |
| **Evidence** | `../upex-bunkai-tms/app/(app)/projects/page.tsx`, `../upex-bunkai-tms/app/(app)/projects/create-project-form.tsx`, `../upex-bunkai-tms/supabase/migrations/0002_projects_modules.sql` |

**Capabilities:**

- [x] List projects.
- [x] Create project with workspace-scoped slug.
- [ ] Update/delete project not verified.

#### Feature: Module tree CRUD, move and archive

| Aspect | Value |
|---|---|
| **ID** | FEAT-MOD-001 |
| **Status** | Stable |
| **Endpoints** | `POST /api/v1/projects/{id}/modules`, `PATCH /api/v1/modules/{id}`, `DELETE /api/v1/modules/{id}` |
| **UI** | Project explorer, create/rename/move/delete dialogs |
| **Users** | Project/workspace members |
| **Dependencies** | Module tree constraints, soft-delete/move migrations |
| **Evidence** | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/project-explorer.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/create-module-form.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/move-module-dialog.tsx`, `../upex-bunkai-tms/supabase/migrations/0014_module_soft_delete.sql`, `../upex-bunkai-tms/supabase/migrations/0015_module_move.sql` |

**Capabilities:**

- [x] Create module.
- [x] Rename module.
- [x] Update description.
- [x] Move subtree.
- [x] Soft-delete/archive subtree.
- [x] Enforce max depth 6.

#### Feature: Project workbench multi-view

| Aspect | Value |
|---|---|
| **ID** | FEAT-PROJ-002 |
| **Status** | Stable |
| **Endpoints** | Project/module/story/ATC/test/run read paths |
| **UI** | Project table/tree/mindmap, tabs, search/filter |
| **Users** | Project/workspace members |
| **Dependencies** | Project shell, explorer, mind map view |
| **Evidence** | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/project-shell.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/project-explorer.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/mind-map-view.tsx` |

**Capabilities:**

- [x] Browse project hierarchy.
- [x] Switch between workbench views.
- [x] Search/filter project assets.

### User Stories And Acceptance Criteria

#### Feature: User Story CRUD

| Aspect | Value |
|---|---|
| **ID** | FEAT-STORY-001 |
| **Status** | Stable |
| **Endpoints** | `GET /api/v1/modules/{id}/user-stories`, `POST /api/v1/modules/{id}/user-stories`, `GET /api/v1/user-stories/{id}`, `PATCH /api/v1/user-stories/{id}`, `DELETE /api/v1/user-stories/{id}` |
| **UI** | Story form, delete dialog, project explorer |
| **Users** | Project/workspace members |
| **Dependencies** | Module ownership, Jira key immutability |
| **Evidence** | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/user-story-form.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/delete-user-story-dialog.tsx`, `../upex-bunkai-tms/supabase/migrations/0003_authoring.sql` |

**Capabilities:**

- [x] Create Story under Module.
- [x] List Stories for Module.
- [x] Edit Story fields.
- [x] Archive Story.
- [x] Preserve Jira key immutability.

#### Feature: Acceptance Criteria CRUD and reorder

| Aspect | Value |
|---|---|
| **ID** | FEAT-AC-001 |
| **Status** | Stable |
| **Endpoints** | `GET /api/v1/user-stories/{id}/acceptance-criteria`, `POST /api/v1/user-stories/{id}/acceptance-criteria`, `GET /api/v1/acceptance-criteria/{id}`, `PATCH /api/v1/acceptance-criteria/{id}`, `DELETE /api/v1/acceptance-criteria/{id}` |
| **UI** | Acceptance criteria panel |
| **Users** | Project/workspace members |
| **Dependencies** | Story ownership, ordering rules, ready-to-test gate |
| **Evidence** | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/acceptance-criteria-panel.tsx`, `../upex-bunkai-tms/supabase/migrations/0017_acceptance_criteria_ordering.sql`, `../upex-bunkai-tms/supabase/migrations/0018_ready_to_test_gate_fn.sql` |

**Capabilities:**

- [x] Add AC.
- [x] Edit AC.
- [x] Reorder ACs.
- [x] Archive AC.
- [x] Maintain gap-free positions.

### ATCs

#### Feature: ATC authoring

| Aspect | Value |
|---|---|
| **ID** | FEAT-ATC-001 |
| **Status** | Stable |
| **Endpoints** | `POST /api/v1/atcs` |
| **UI** | `/projects/[slug]/atcs/new` |
| **Users** | Project/workspace members, API clients with `atc:write` |
| **Dependencies** | User Story, Acceptance Criteria, Monaco editor |
| **Evidence** | `../upex-bunkai-tms/components/atcs/NewAtcEditor.tsx`, `../upex-bunkai-tms/components/atcs/StepEditor.tsx`, `../upex-bunkai-tms/components/atcs/AnchoringPanel.tsx` |

**Capabilities:**

- [x] Create ATC anchored to Story.
- [x] Link ATC to one or more ACs.
- [x] Author ordered steps.
- [x] Author assertions.
- [x] Assign layer and tags.
- [x] Preview ATC content.

#### Feature: ATC read, edit, search, duplicate and usage

| Aspect | Value |
|---|---|
| **ID** | FEAT-ATC-002 |
| **Status** | Stable |
| **Endpoints** | `PATCH /api/v1/atcs/{id}`, `GET /api/v1/atcs/search`, `POST /api/v1/atcs/{id}/duplicate`, `GET /api/v1/atcs/{id}/usage` |
| **UI** | ATC detail/editor/table/search/explorer actions |
| **Users** | Project/workspace members, API clients with `atc:read`/`atc:write` |
| **Dependencies** | ATC optimistic locking, search index, usage lookup |
| **Evidence** | `../upex-bunkai-tms/components/atcs/AtcEditor.tsx`, `../upex-bunkai-tms/components/atcs/AtcTable.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/atc-search-filter.tsx`, `../upex-bunkai-tms/supabase/migrations/0027_atc_search.sql`, `../upex-bunkai-tms/supabase/migrations/0028_atc_duplicate.sql`, `../upex-bunkai-tms/supabase/migrations/0029_atc_usage.sql` |

**Capabilities:**

- [x] Replace ATC content with optimistic lock protection.
- [x] Search by title, tags and layer.
- [x] Duplicate ATC deeply.
- [x] Show Tests using an ATC.
- [ ] Direct archive/delete ATC not verified.

### Tests

#### Feature: Test chain creation and read

| Aspect | Value |
|---|---|
| **ID** | FEAT-TEST-001 |
| **Status** | Stable |
| **Endpoints** | `POST /api/v1/tests`, `GET /api/v1/tests/{id}` |
| **UI** | `/tests/new`, `/tests/[testId]` |
| **Users** | Project/workspace members, API clients with ATC scopes |
| **Dependencies** | ATC catalog, ordered `test_steps` |
| **Evidence** | `../upex-bunkai-tms/components/tests/NewTestBuilder.tsx`, `../upex-bunkai-tms/components/tests/TestDetailView.tsx`, `../upex-bunkai-tms/supabase/migrations/0024_tests.sql`, `../upex-bunkai-tms/supabase/migrations/0025_test_read.sql` |

**Capabilities:**

- [x] Create Test by chaining ATCs.
- [x] Preserve duplicate ATC references as separate steps.
- [x] Read expanded Test with live ATC content.

#### Feature: Test reorder and tags

| Aspect | Value |
|---|---|
| **ID** | FEAT-TEST-002 |
| **Status** | Stable |
| **Endpoints** | `PATCH /api/v1/tests/{id}/reorder`, `PUT /api/v1/tests/{id}/tags`, `GET /api/v1/tests?tag=` |
| **UI** | Reorder client, tag editor/filter |
| **Users** | Project/workspace members, API clients with `atc:write` |
| **Dependencies** | Optimistic lock, tag table/filtering |
| **Evidence** | `../upex-bunkai-tms/components/tests/TestReorderClient.tsx`, `../upex-bunkai-tms/components/tests/TestTagEditor.tsx`, `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/test-tag-filter.tsx`, `../upex-bunkai-tms/supabase/migrations/0026_tests_reorder.sql`, `../upex-bunkai-tms/supabase/migrations/0030_test_tags.sql` |

**Capabilities:**

- [x] Reorder Test chain.
- [x] Replace Test tags.
- [x] Filter Tests by tag.
- [x] Protect concurrent reorder with optimistic locking.

### Runs

#### Feature: Manual Run lifecycle

| Aspect | Value |
|---|---|
| **ID** | FEAT-RUN-001 |
| **Status** | Partial |
| **Endpoints** | `POST /api/v1/runs`, `GET /api/v1/runs/{id}`, `POST /api/v1/runs/{id}/abort`, `POST /api/v1/runs/{id}/finish` |
| **UI** | Runner view, start run button |
| **Users** | Project/workspace members, API clients with `run:execute` |
| **Dependencies** | Project Environment, Test snapshot, terminal state transitions |
| **Evidence** | `../upex-bunkai-tms/components/tests/StartRunButton.tsx`, `../upex-bunkai-tms/components/runs/RunnerView.tsx`, `../upex-bunkai-tms/supabase/migrations/0031_runs.sql`, `../upex-bunkai-tms/supabase/migrations/0036_run_abort.sql`, `../upex-bunkai-tms/supabase/migrations/0037_run_finish.sql` |

**Capabilities:**

- [x] Start Run against Test and Environment.
- [x] Snapshot ATCs and steps.
- [x] Read expanded Run.
- [x] Abort Run.
- [x] Finish Run as terminal state.
- [ ] Mark individual steps pass/fail/block with evidence not verified.

### Imports, API And Tokens

#### Feature: Jira import async

| Aspect | Value |
|---|---|
| **ID** | FEAT-IMPORT-001 |
| **Status** | Partial |
| **Endpoints** | `POST /api/v1/imports`, `GET /api/v1/imports/{id}` |
| **UI** | Jira import dialog |
| **Users** | Project/workspace members |
| **Dependencies** | Jira credentials, import job worker, ADF parser |
| **Evidence** | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/import-from-jira-dialog.tsx`, `../upex-bunkai-tms/lib/jira/import-runner.ts`, `../upex-bunkai-tms/supabase/migrations/0019_import_jobs.sql`, `../upex-bunkai-tms/supabase/migrations/0020_import_jobs_one_active.sql` |

**Capabilities:**

- [x] Enqueue Jira import job.
- [x] Poll import status.
- [x] Parse Jira ADF/Acceptance Criteria.
- [x] Upsert Modules and Stories.
- [ ] Webhook/runtime import path not verified.

#### Feature: API-first discoverability and OpenAPI docs

| Aspect | Value |
|---|---|
| **ID** | FEAT-API-001 |
| **Status** | Stable |
| **Endpoints** | `GET /api/v1`, `GET /api/v1/health`, `GET /api/openapi`, `/api/docs` |
| **UI** | Scalar docs, `/qa` helper |
| **Users** | API clients, QA engineers, AI agents |
| **Dependencies** | OpenAPI JSON, Scalar UI |
| **Evidence** | `../upex-bunkai-tms/public/openapi.json`, `../upex-bunkai-tms/app/api/docs/page.tsx`, `../upex-bunkai-tms/app/qa/page.tsx` |

**Capabilities:**

- [x] Serve API discovery metadata.
- [x] Serve health endpoint.
- [x] Serve OpenAPI JSON.
- [x] Render interactive API docs.
- [x] Provide QA request helper examples.

#### Feature: Personal Access Tokens and scopes

| Aspect | Value |
|---|---|
| **ID** | FEAT-PAT-001 |
| **Status** | Stable |
| **Endpoints** | `GET /api/v1/tokens`, `POST /api/v1/tokens`, `DELETE /api/v1/tokens/{id}` |
| **UI** | API/token management surface not fully verified |
| **Users** | Authenticated users, AI/CLI clients |
| **Dependencies** | PAT hashing, scope enforcement, principal resolver |
| **Evidence** | `../upex-bunkai-tms/app/api/v1/tokens/route.ts`, `../upex-bunkai-tms/lib/api/pat.ts`, `../upex-bunkai-tms/lib/api/principal.ts`, `../upex-bunkai-tms/supabase/migrations/0008_access_tokens.sql` |

**Capabilities:**

- [x] Issue PAT.
- [x] List PATs.
- [x] Revoke PAT.
- [x] Enforce `atc:read`, `atc:write`, `run:execute`, `workspace:admin` scopes.

#### Feature: RLS, RBAC, audit and idempotency governance

| Aspect | Value |
|---|---|
| **ID** | FEAT-GOV-001 |
| **Status** | Stable |
| **Endpoints** | Cross-cutting API handler and policies |
| **UI** | Not user-facing |
| **Users** | System, workspace members, API clients |
| **Dependencies** | Supabase RLS, activity log, idempotency keys |
| **Evidence** | `../upex-bunkai-tms/supabase/migrations/0005_rls_helpers.sql`, `../upex-bunkai-tms/supabase/migrations/0009_cross_cutting.sql`, `../upex-bunkai-tms/lib/api/handler.ts`, `../upex-bunkai-tms/lib/api/principal.ts` |

**Capabilities:**

- [x] Enforce workspace roles.
- [x] Apply RLS helpers.
- [x] Record activity log.
- [x] Support idempotency keys.
- [x] Avoid disclosure through authorization errors.

## 3. CRUD Matrix

Legend: Full = complete user/API capability; Partial = conditional, soft-delete, or narrowed operation; Missing = not verified as exposed capability.

| Entity | Create | Read | Update | Delete | Evidence |
|---|---|---|---|---|---|
| Workspace | Full | Full | Partial: name only | Missing | `../upex-bunkai-tms/app/api/v1/workspaces/route.ts`, `../upex-bunkai-tms/app/api/v1/workspaces/[id]/route.ts` |
| WorkspaceInvite | Full | Full | Partial: rotate/resend | Partial: revoke | `../upex-bunkai-tms/app/api/v1/workspaces/[id]/invites/route.ts` |
| Project | Full | Partial: UI/API list | Missing | Missing | `../upex-bunkai-tms/app/api/v1/workspaces/[id]/projects/route.ts`, `../upex-bunkai-tms/app/(app)/projects/page.tsx` |
| Module | Full | Full | Full | Partial: soft archive | `../upex-bunkai-tms/app/api/v1/projects/[id]/modules/route.ts`, `../upex-bunkai-tms/app/api/v1/modules/[id]/route.ts` |
| UserStory | Full | Full | Full | Partial: soft archive | `../upex-bunkai-tms/app/api/v1/modules/[id]/user-stories/route.ts`, `../upex-bunkai-tms/app/api/v1/user-stories/[id]/route.ts` |
| AcceptanceCriterion | Full | Full | Full | Partial: archive | `../upex-bunkai-tms/app/api/v1/user-stories/[id]/acceptance-criteria/route.ts`, `../upex-bunkai-tms/app/api/v1/acceptance-criteria/[id]/route.ts` |
| ATC | Full | Full: search/detail | Full: replace | Missing: archive/delete not exposed | `../upex-bunkai-tms/app/api/v1/atcs/route.ts`, `../upex-bunkai-tms/app/api/v1/atcs/[id]/route.ts` |
| Test | Full | Full | Partial: reorder/tags only | Missing | `../upex-bunkai-tms/app/api/v1/tests/route.ts`, `../upex-bunkai-tms/app/api/v1/tests/[id]/*` |
| ProjectEnvironment | Full | Full | Full: rename | Partial: hard delete if unused | `../upex-bunkai-tms/app/api/v1/projects/[id]/environments/route.ts`, `../upex-bunkai-tms/app/api/v1/environments/[id]/route.ts` |
| Run | Full | Full | Partial: abort/finish terminal only | Missing | `../upex-bunkai-tms/app/api/v1/runs/route.ts`, `../upex-bunkai-tms/app/api/v1/runs/[id]/*` |
| AccessToken | Full | Full | Missing | Partial: soft revoke | `../upex-bunkai-tms/app/api/v1/tokens/route.ts`, `../upex-bunkai-tms/app/api/v1/tokens/[id]/route.ts` |
| ImportJob | Full: enqueue | Full: poll | Partial: worker updates status | Missing | `../upex-bunkai-tms/app/api/v1/imports/route.ts`, `../upex-bunkai-tms/app/api/v1/imports/[id]/route.ts` |
| FeatureFlag | Partial: DB table | Missing | Missing | Missing | `../upex-bunkai-tms/supabase/migrations/0009_cross_cutting.sql` |
| ActivityLog | Full: system writes | Partial: DB only | Missing | Missing | `../upex-bunkai-tms/supabase/migrations/0009_cross_cutting.sql` |

## 4. API Endpoint Inventory

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/v1` | API discovery | Public |
| GET | `/api/v1/health` | Liveness check | Public |
| POST | `/api/v1/auth/check-email` | Email routing | Public |
| POST | `/api/v1/auth/signup` | Signup and OTP | Public |
| POST | `/api/v1/auth/confirm` | OTP to session/PAT | Public |
| POST | `/api/v1/auth/signin` | Password sign-in and PAT | Public |
| POST | `/api/v1/auth/magic-link` | Magic link email | Public |
| GET | `/api/v1/me` | Principal and workspaces | Authenticated |
| POST | `/api/v1/me/active-workspace` | Set active workspace cookie | Authenticated |
| GET/POST | `/api/v1/workspaces` | List/create workspace | Authenticated |
| GET/PATCH | `/api/v1/workspaces/{id}` | Read/update workspace | Authenticated; `workspace:admin` for update |
| GET/POST | `/api/v1/workspaces/{id}/invites` | List/create invites | `workspace:admin` |
| POST/DELETE | `/api/v1/workspaces/{id}/invites/{inviteId}` | Rotate/revoke invite | `workspace:admin` |
| POST | `/api/v1/invites/accept` | Accept invite token | Authenticated |
| POST | `/api/v1/workspaces/{id}/projects` | Create project | Workspace member |
| POST | `/api/v1/projects/{id}/modules` | Create module | Project/workspace member |
| PATCH/DELETE | `/api/v1/modules/{id}` | Rename/move/archive module | Project/workspace member |
| GET/POST | `/api/v1/modules/{id}/user-stories` | List/create Stories | Project/workspace member |
| GET/PATCH/DELETE | `/api/v1/user-stories/{id}` | Story read/edit/archive | Project/workspace member |
| GET/POST | `/api/v1/user-stories/{id}/acceptance-criteria` | List/add AC | Project/workspace member |
| GET/PATCH/DELETE | `/api/v1/acceptance-criteria/{id}` | AC read/edit/reorder/archive | Project/workspace member |
| GET/POST | `/api/v1/projects/{id}/environments` | List/create Environment | Project/workspace member |
| PATCH/DELETE | `/api/v1/environments/{id}` | Rename/delete Environment | Project/workspace member |
| POST | `/api/v1/imports` | Start Jira import | Project/workspace member |
| GET | `/api/v1/imports/{id}` | Poll import | Project/workspace member |
| POST | `/api/v1/atcs` | Create ATC | Cookie auth or `atc:write` |
| GET | `/api/v1/atcs/search` | Search ATCs | Cookie auth or `atc:read` |
| PATCH | `/api/v1/atcs/{id}` | Edit ATC | Cookie auth or `atc:write` |
| POST | `/api/v1/atcs/{id}/duplicate` | Deep-copy ATC | Cookie auth or `atc:write` |
| GET | `/api/v1/atcs/{id}/usage` | List Tests using ATC | Cookie auth or `atc:read` |
| GET/POST | `/api/v1/tests` | Tag-filter / create Test | Cookie auth or ATC scopes |
| GET | `/api/v1/tests/{id}` | Read expanded Test | Authenticated |
| PATCH | `/api/v1/tests/{id}/reorder` | Reorder Test chain | `atc:write` |
| PUT | `/api/v1/tests/{id}/tags` | Replace Test tags | `atc:write` |
| POST | `/api/v1/runs` | Start Run | `run:execute` |
| GET | `/api/v1/runs/{id}` | Read Run snapshot | Authenticated |
| POST | `/api/v1/runs/{id}/abort` | Abort Run | `run:execute` |
| POST | `/api/v1/runs/{id}/finish` | Finish Run | `run:execute` |
| GET/POST | `/api/v1/tokens` | List/issue PAT | Session auth |
| DELETE | `/api/v1/tokens/{id}` | Revoke PAT | Authenticated |

## 5. UI Component Inventory

### Forms

| UI | Actions | Evidence |
|---|---|---|
| `/login` | Email-first, sign-in, sign-up, OTP, resend, magic link, OAuth | `../upex-bunkai-tms/app/(auth)/login/*.tsx` |
| `/onboarding` | Create initial workspace | `../upex-bunkai-tms/app/(app)/onboarding/onboarding-form.tsx` |
| `/projects` | Create project | `../upex-bunkai-tms/app/(app)/projects/create-project-form.tsx` |
| Project workbench | Create/edit Modules, Stories, ACs | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/*.tsx` |
| ATC editor | Create/edit ATC, steps, assertions, tags, preview | `../upex-bunkai-tms/components/atcs/*.tsx` |
| Test builder | Chain ATCs into Tests | `../upex-bunkai-tms/components/tests/NewTestBuilder.tsx` |

### Dashboards And Views

| UI | Purpose | Evidence |
|---|---|---|
| Project list | Workspace project entry point | `../upex-bunkai-tms/app/(app)/projects/page.tsx` |
| Project workbench | Tree/table/mindmap exploration | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/project-shell.tsx` |
| ATC table | ATC browsing/search/filter | `../upex-bunkai-tms/components/atcs/AtcTable.tsx` |
| Test detail | Expanded Test chain | `../upex-bunkai-tms/components/tests/TestDetailView.tsx` |
| Runner view | Run snapshot and terminal actions | `../upex-bunkai-tms/components/runs/RunnerView.tsx` |
| Members page | Workspace invite/member management | `../upex-bunkai-tms/app/(app)/workspaces/[id]/members/members-client.tsx` |
| API docs | Scalar OpenAPI UI | `../upex-bunkai-tms/app/api/docs/page.tsx` |
| QA helper | Request examples and environment setup | `../upex-bunkai-tms/app/qa/page.tsx`, `../upex-bunkai-tms/app/qa/_components/*.tsx` |
| Design tokens | Visual token reference | `../upex-bunkai-tms/app/design-tokens/page.tsx` |

### Actions And Dialogs

| Action | Purpose | Evidence |
|---|---|---|
| Move module dialog | Move module subtree | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/move-module-dialog.tsx` |
| Delete Story dialog | Archive Story | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/delete-user-story-dialog.tsx` |
| Jira import dialog | Enqueue and poll import | `../upex-bunkai-tms/app/(app)/projects/[projectSlug]/import-from-jira-dialog.tsx` |
| Test reorder | Reorder Test steps | `../upex-bunkai-tms/components/tests/TestReorderClient.tsx` |
| Start Run button | Create Run from Test | `../upex-bunkai-tms/components/tests/StartRunButton.tsx` |

## 6. Third-Party Integrations

| Service | Purpose | Package / Env | Status | Features Using It |
|---|---|---|---|---|
| Supabase | Auth, Postgres, RLS, SSR session | `@supabase/ssr`, `@supabase/supabase-js`, `NEXT_PUBLIC_SUPABASE_*` | Active | Auth, workspace, data model, RLS |
| Vercel | Hosting and deployment env | Vercel env manifest | Active / inferred | Web app deployment |
| Jira / Atlassian | Requirements import and QA tooling | `ATLASSIAN_*`, `lib/jira/*` | Partial active | Jira import |
| Resend | Transactional email | `RESEND_API_KEY` | Configured; runtime invite email not verified | Workspace invites |
| Scalar | OpenAPI docs UI | `@scalar/api-reference-react` | Active | API docs |
| Monaco | Rich ATC editing | `@monaco-editor/react` | Active | ATC authoring |
| Radix UI | Dialogs, tabs, dropdowns | `@radix-ui/*` | Active | App UI system |
| dnd-kit | Drag and reorder interactions | `@dnd-kit/*` | Active | Test reorder |
| cmdk | Command palette/search | `cmdk` | Stub / partial | Command palette |
| n8n | Optional automation | `N8N_API_URL`, `N8N_API_KEY` | Optional/local | Automation experiments |

## 7. Feature Flags And WIP

| Flag / Planned Feature | Description | Default / Status | Environment / Evidence |
|---|---|---|---|
| `feature_flags` table | Database support for feature flags, no verified UI/API exposure | Planned / not exposed | `../upex-bunkai-tms/supabase/migrations/0009_cross_cutting.sql` |
| Command palette | `cmdk` palette placeholder | Stub / partial | `../upex-bunkai-tms/components/layout/CommandPalette.tsx` |
| Run step execution | Runner can show snapshot; granular mark-pass/mark-fail/block appears pending | Partial | `../upex-bunkai-tms/components/runs/RunnerView.tsx` |
| Invite email delivery | Invite API can return token/accept URL; email delivery not verified | Partial | `../upex-bunkai-tms/app/api/v1/workspaces/[id]/invites/route.openapi.ts` |
| `bunkai run import` CLI | CLI import command planned in docs | Planned | `../upex-bunkai-tms/.context/SRS/functional-specs.md` |
| Self-hosted Docker / Enterprise / marketplace | Future product packaging and monetization | Planned | `../upex-bunkai-tms/.context/master-implementation-plan.md` |
| `FEATURE_`, `ENABLE_`, `BETA_` runtime env flags | No app runtime flag found during discovery | Not confirmed | App code search |

## 8. QA Relevance

### Feature Test Coverage Matrix

| Feature ID | Unit | Integration | E2E | Status |
|---|---|---|---|---|
| FEAT-AUTH-001 | Partial | Partial | Unknown | Needs auth flow E2E |
| FEAT-WS-001 | Partial | Partial | Unknown | Needs workspace bootstrap E2E |
| FEAT-WS-002 | Partial | Partial | Unknown | Needs invite happy/negative paths |
| FEAT-PROJ-001 | Unknown | Partial | Unknown | Needs project create/read coverage |
| FEAT-MOD-001 | Partial | Partial | Unknown | Needs tree move/archive regression |
| FEAT-STORY-001 | Partial | Partial | Unknown | Needs Story CRUD E2E/API coverage |
| FEAT-AC-001 | Partial | Partial | Unknown | Needs ordering and ready-to-test coverage |
| FEAT-ATC-001 | Partial | Partial | Unknown | Needs ATC authoring coverage |
| FEAT-ATC-002 | Partial | Partial | Unknown | Needs edit/search/duplicate/usage coverage |
| FEAT-TEST-001 | Partial | Partial | Unknown | Needs chain creation coverage |
| FEAT-TEST-002 | Partial | Partial | Unknown | Needs reorder/tag concurrency coverage |
| FEAT-RUN-001 | Partial | Partial | Unknown | Needs snapshot and terminal-state coverage |
| FEAT-IMPORT-001 | Partial | Partial | Unknown | Needs Jira import idempotency coverage |
| FEAT-API-001 | Unknown | Partial | Not applicable | Needs OpenAPI smoke validation |
| FEAT-PAT-001 | Partial | Partial | Unknown | Needs scope enforcement coverage |
| FEAT-GOV-001 | Partial | Partial | Not applicable | Needs RLS/RBAC regression suite |

### High-Risk Features

| Feature | Risk | Reason | Evidence |
|---|---|---|---|
| Workspace isolation and RLS | HIGH | Cross-tenant data leak would be severe. | `../upex-bunkai-tms/supabase/migrations/0005_rls_helpers.sql`, `../upex-bunkai-tms/lib/tests/rls-isolation.test.ts` |
| Auth and PAT coexistence | HIGH | Cookie/PAT/scope flows converge in authorization; privilege escalation risk. | `../upex-bunkai-tms/lib/api/principal.ts`, `../upex-bunkai-tms/lib/api/pat.ts` |
| ATC update propagation | HIGH | Core product promise is one-edit-many-tests without corrupting dependent assets. | `../upex-bunkai-tms/supabase/migrations/0035_atc_update_propagation.sql` |
| Run snapshot integrity | HIGH | Historical evidence must not mutate when source Test/ATC changes. | `../upex-bunkai-tms/supabase/migrations/0031_runs.sql`, `../upex-bunkai-tms/components/runs/RunnerView.tsx` |
| Module move/archive subtree | HIGH | Tree mutations can break paths, Stories, ATCs and navigation. | `../upex-bunkai-tms/supabase/migrations/0014_module_soft_delete.sql`, `../upex-bunkai-tms/supabase/migrations/0015_module_move.sql` |
| Jira import idempotency/concurrency | HIGH | Imports can duplicate or overwrite externally sourced requirements. | `../upex-bunkai-tms/lib/jira/import-runner.ts`, `../upex-bunkai-tms/supabase/migrations/0020_import_jobs_one_active.sql` |
| Test reorder/tags optimistic locking | MEDIUM | Concurrent edits can corrupt chain order or tags. | `../upex-bunkai-tms/supabase/migrations/0026_tests_reorder.sql`, `../upex-bunkai-tms/supabase/migrations/0030_test_tags.sql` |
| Run finish vs abort race | HIGH | Terminal state must be first-wins and serialized. | `../upex-bunkai-tms/supabase/migrations/0036_run_abort.sql`, `../upex-bunkai-tms/supabase/migrations/0037_run_finish.sql` |

## 9. Discovery Gaps

- Live DB was not queried; SQL migrations were treated as source of truth.
- OAuth provider setup for Google/GitHub was not verified in Supabase runtime.
- `feature_flags` exists at database level, but no UI/API feature flag management surface was verified.
- Direct ATC archive/delete was not verified; this may be a product decision or missing capability.
- Project update/delete was not verified.
- Granular Run step execution with pass/fail/block evidence was not verified; runner appears partial for this capability.
- Resend is configured, but invite email delivery was not runtime-verified.
- Jira/Resend incoming webhooks were not confirmed.
- Observability tools mentioned in business context, such as Sentry/PostHog, were not evidenced in current dependencies during discovery.

## Sources Used

- `.context/business/business-data-map.md`
- `.context/business/business-model.md`
- `.context/PRD/`
- `.context/SRS/`
- `../upex-bunkai-tms/app/`
- `../upex-bunkai-tms/components/`
- `../upex-bunkai-tms/lib/`
- `../upex-bunkai-tms/supabase/migrations/`
- `../upex-bunkai-tms/package.json`
