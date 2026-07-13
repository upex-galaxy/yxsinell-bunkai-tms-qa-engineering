# Comments for BK-167

[View in Jira](https://jira.upexgalaxy.com/browse/BK-167)

---

### Automation for Jira - 21/6/2026, 18:04:53

🔎 Pull Request created. Task is pending to ANALYZE and REVIEW by the team. Waiting for PR Approval.

---

### Automation for Jira - 21/6/2026, 18:40:44

✅ Pull Request is successfully MERGED. Task is Done.

---

### Ely - 21/6/2026, 19:08:49

Merged to staging and deployed (status: FIXED). Ready for QA verification on staging.

PR: https://github.com/upex-galaxy/upex-bunkai-tms/pull/52 (merged, commit 59d23a1)
Branch: feat/BK-167-enforce-workspace-admin-scope

What changed (see ADR-0006): the workspace:admin scope is now enforced on consumption. Admin endpoints (invite create/list/resend/revoke, workspace settings PATCH) require requires:['workspace:admin'] AND a workspace-context match for PAT callers. Cookie/UI sessions unchanged. No DB change.

QA test scenarios:

1. PAT lacking workspace:admin (e.g. atc:read only) -> POST /api/v1/workspaces/{id}/invites -> expect 403.
2. PAT with workspace:admin scoped to workspace A -> admin endpoint targeting workspace B -> expect 403.
3. PAT with workspace:admin scoped to workspace A (user admin/owner of A) -> same endpoint targeting A -> expect success.
4. Admin/owner cookie session -> admin endpoints still work; member cookie session -> still 403.
5. GET /api/v1/workspaces/{id} (read) remains accessible to members (not gated).

Relates to BK-135 and BK-88. Broad non-ATC enforcement is BK-168.

---


_Synced from Jira by sync-jira-issues_
