# Comments for BK-49

[View in Jira](https://jira.upexgalaxy.com/browse/BK-49)

---

### José Andrés Lorca - 29/6/2026, 19:55:55

## Acceptance Test Plan (ATP) - Shift-Left DRAFT ready for review

The ATP DRAFT lives in the Acceptance Test Plan (ATP) field.

Action Required: review ambiguities, answer critical PO questions, confirm edge-case behavior, and validate technical decisions before implementation.

Refined on: 2026-06-29 - QA Shift-Left batch session

- Local working copy: 
.context/PBI/epics/EPIC-BK-44-coverage-traceability/stories/STORY-BK-49-tms-activity-stream-a-read-side-feed-over-the-exis/shift-left-refinement.md

---

### José Andrés Lorca - 8/7/2026, 20:37:58

Acting as PO Proxy to help accelerate the estimation flow, following Ely's guidance, BK-49 is estimated at 5 SP under a bounded MVP scope.

The 5 SP estimate applies if the scope remains limited to:
- Read-side feed over the existing `activity_log`.
- Paginated reads.
- Newest-first ordering.
- Workspace-scoped visibility.
- Visibility for workspace members while respecting the current permissions/RLS model.
- No realtime, polling, push, or auto-refresh.
- No new event writers within this story.
- Bug/defect activity out of scope unless a confirmed writer exists or is added separately.

Expected effort is mainly concentrated on:
- Read model / query contract.
- Deterministic pagination.
- Feed UI rendering.
- Event taxonomy/labels.
- Workspace isolation.
- Loading, error, empty, and pagination-end states.
- Safe fallbacks for deleted or unavailable actor/item references.

Justification:
The existing `activity_log`, current event writers, indexes, and permissions/RLS model reduce the backend scope. The remaining complexity is in exposing and rendering the feed in a safe, consistent, and testable way.

If realtime/polling, new event writers, defect activity, or a broader public API are added, the story should be re-estimated as 8+ SP or split into separate follow-up stories.

---


_Synced from Jira by sync-jira-issues_
