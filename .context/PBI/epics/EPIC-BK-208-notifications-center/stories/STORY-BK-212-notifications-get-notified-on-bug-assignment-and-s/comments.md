# Comments for BK-212

[View in Jira](https://jira.upexgalaxy.com/browse/BK-212)

---

### Ely - 11/7/2026, 17:52:25

## PO Ratification — 2026-07-11

- N5 — The bug status vocabulary remains DEFERRED to the Bugs epic (BK-31) lifecycle definitions; this deferral is itself the ratified decision. The dependency note in the Business Rules field stands as-is; no change needed.

---

### yxsinell acosta zambrano - 19/7/2026, 21:32:05

## Shift-Left Handoff — BK-212 ready for estimation review

Shift-Left refinement is complete for ***BK-212 — Notifications | Get notified on bug assignment and status changes***.

What was updated:

- Refined Acceptance Criteria were written to the Acceptance Criteria field.
- ATP DRAFT was written to the Acceptance Test Plan field.
- Labels added: `shift-left-reviewed`, `shift-left-2026-07-19`.
- Story Points set to ***8***.

Why these decisions were taken:

- This Story is not only UI copy in the inbox. It owns recipient decision logic for bug assignment/status events, self-notification suppression, dedupe, visibility enforcement, and deep links.
- BK-31 owns bug lifecycle/status vocabulary, so BK-212 must consume those events instead of inventing a parallel status model.
- BK-209 owns inbox rendering, so BK-212 must produce notifications compatible with that substrate instead of building a separate surface.

Implementation gate:

- Estimate is valid assuming BK-31 exposes bug events and BK-209 provides inbox persistence/rendering.
- If those dependencies are missing at implementation time, split or re-estimate as 13 SP.

---

### yxsinell acosta zambrano - 19/7/2026, 21:32:06

## Shift-Left Role Decisions — PO / Dev / Design answers

### PO decisions

| Question | Answer | Why |
| --- | --- | --- |
| Can BK-212 be developed before BK-31 ships bug lifecycle events? | No. Estimate now, but start implementation only after BK-31 exposes assignment/status events. | Without source events, QA cannot validate real notification behavior. |
| What happens when a bug has no run/test context attached? | Deep link lands on bug detail and shows available context only. | Prevents broken links while preserving the Story promise. |
| Should previous assignees be notified when reassigned away? | No. Only the new assignee is notified in this Story. | Keeps scope aligned with current Business Rules. |

### Dev decisions

| Question | Answer | Why |
| --- | --- | --- |
| Which event contract powers this Story? | `bug.assigned` and `bug.status_changed` from BK-31. | Keeps notification logic tied to the bug domain source of truth. |
| How is duplicate delivery prevented? | Unique key: source event id + recipient id; build recipients as a set before insert. | Prevents duplicate inbox rows when reporter and assignee are the same user or retries happen. |
| Where is visibility enforced? | At recipient resolution and again when reading/opening inbox notifications. | Prevents stale notifications leaking inaccessible bug metadata. |

### Design decisions

| Question | Answer | Why |
| --- | --- | --- |
| What should the notification row show? | Bug icon, bug title, `Assigned to you` or `Status changed: <old> -> <new>`, and BK-31 severity chip when available. | Gives Sara enough context without opening the bug. |
| What if only next status is available? | Render `Status changed to <new>`. | Keeps UI robust if BK-31 event payload is minimal. |
| How should inaccessible bug links behave? | Hide inaccessible rows; stale clicked links use permission-safe not-found state. | Avoids bug metadata leakage. |

---

### yxsinell acosta zambrano - 19/7/2026, 21:32:06

## Estimate Rationale — BK-212 = 8 SP

Recommended and applied estimate: ***8 Story Points***.

Why not 5 SP:

- The work is more than rendering a notification row. Recipient logic changes by event type and must exclude the actor.
- Dedupe is required when reporter and assignee are the same person.
- Visibility must be checked so project/workspace access changes do not leak bug metadata.
- Deep links must land on bug detail with run/test context when available.

Why not 13 SP:

- BK-31 owns bug lifecycle/event source.
- BK-209 owns inbox surface/persistence/rendering.
- BK-212 should consume those contracts, not build them.

Re-estimation trigger:

- If BK-31 or BK-209 foundations are not available when development starts, this becomes ***13 SP*** or should be split into event-source/inbox-consumer work.

---


_Synced from Jira by sync-jira-issues_
