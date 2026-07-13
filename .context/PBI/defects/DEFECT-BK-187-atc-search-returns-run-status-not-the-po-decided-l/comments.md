# Comments for BK-187

[View in Jira](https://jira.upexgalaxy.com/browse/BK-187)

---

### Facu Barea - 30/6/2026, 22:54:28

***QA → Dev handoff***

This Defect blocks ***BK-20*** (TMS-ATC Search), currently BLOCKED in QA.

***TL;DR******:**** `GET /api/v1/atcs/search` returns the wrong `status` semantics on each result item. The autocomplete picker (EPIC-BK-5) needs the ATC ****lifecycle**** state to drive reuse decisions, but the endpoint returns the ****run-status*** of the last execution instead.

***Reproduce***

1. Authenticate with an `atc:read` PAT.
2. `GET /api/v1/atcs/search?query=login&project_id=4f9f81d0-dcec-466e-9860-173907fd21c7`
3. Inspect any item in `items[]`.

***Expected (per PO decision)******:*** each item exposes the ATC lifecycle status — `status_dot` ∈ `{draft, ready, automated, deprecated}`.

***Actual******:*** item shape is `{id, slug, title, layer, status, module*path}` where `status` carries run-status semantics — `{pass, fail, blocked, skipped, running, unrun}`, defaulting to `unrun` for never-run ATCs. (The id field is also `id`, not the planned `atc*id`.)

***Why it matters******:*** the discovery/autocomplete picker can't surface reuse-readiness — a brand-new ATC always reads `unrun`, which tells the user nothing about whether it is ready to reuse. Cheap to fix now, before BK-5 consumes this contract.

***Severity******:*** Mayor / Priority High.

***Not affected (verified PASS)******:*** search ranking, prefix + multi-word AND matching, module-subtree filter, layer filter, validation 422s, auth 401/403, and tenant isolation (workspace + project, confirmed at both API and SQL level). The block is purely the response `status` field.

Full per-TC evidence is in the BK-20 ATR (23 PASS / 1 FAIL).

---


_Synced from Jira by sync-jira-issues_
