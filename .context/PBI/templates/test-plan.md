# Test Plan Format Reference

> Reference-only guide. Story-scoped ATP/ATR files are synced from Jira/Xray; do not fill this file for a real ticket.

## Header

| Field | Value |
|---|---|
| Story Key | `[BK-123]` |
| Story Title | `[story title]` |
| Sprint | `[sprint name]` |
| Environment | `local / staging / production-smoke` |
| QA Owner | `[qa assignee]` |
| Date | `[YYYY-MM-DD]` |

## Scope

### In Scope

- [observable behavior under test]

### Out of Scope

- [explicit exclusions]

## AC -> Test Case Mapping

| AC | Test Case | Type | Priority | Automation Candidate | Notes |
|---|---|---|---|---|---|
| AC1 | TC-001 | UI/API/DB | P0/P1/P2 | Yes/No | [notes] |

## Test Types

| Type | Required | Reason |
|---|---|---|
| Functional | Yes | AC conformance. |
| UI | Depends | Required for user-visible flows. |
| API | Depends | Required for API/PAT/backend behavior. |
| DB | Depends | Required for RLS, snapshots, persistence. |
| Security | Depends | Required for auth, roles, tenant isolation. |
| Accessibility | Depends | Required for critical UI flows. |
| Performance | Depends | Required for search/tree/run flows when risk exists. |

## Test Data Requirements

| Data | Source | Reset / Cleanup |
|---|---|---|
| Workspace | Fixture / seeded data / live Jira context | [cleanup rule] |
| Project | Fixture / seeded data | [cleanup rule] |
| Module / Story / AC | Fixture / synced issue | [cleanup rule] |
| User roles | `.env` test users | [cleanup rule] |

## Test Cases

### TC-001 — [scenario name]

| Field | Value |
|---|---|
| Priority | P0 |
| Type | UI/API/DB |
| AC Ref | AC1 |
| Preconditions | [state/data/session] |
| Steps | 1. [step] 2. [step] |
| Expected | [observable result] |
| Automatable | Yes/No |

## Edge Cases And Negative Tests

- [ ] Invalid or missing required field.
- [ ] Unauthorized role.
- [ ] Cross-workspace isolation.
- [ ] Duplicate or stale data.
- [ ] Network/API error.
- [ ] Boundary value.

## Execution Checklist

- [ ] Smoke environment reachable.
- [ ] Test data prepared.
- [ ] AC-conformance tests executed.
- [ ] Risk-beyond-AC tests executed.
- [ ] Evidence captured for failures.
- [ ] Bugs/defects/improvements filed and linked.
- [ ] ATR written to Jira/Xray and synced.

## Discovery Gaps

- [ ] Live TMS modality (Jira-native vs Xray) not revalidated in Phase 4.
- [ ] Current sprint naming/cadence not verified live.
