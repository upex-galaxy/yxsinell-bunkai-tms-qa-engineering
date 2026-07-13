# Comments for BK-61

[View in Jira](https://jira.upexgalaxy.com/browse/BK-61)

---

### Nahuel Gomez - 6/6/2026, 0:36:29

## Test Evidence — BK-61

### Repro Steps

```bash
# 1. Create first invite for email
curl -X POST https://staging-upexbunkai.vercel.app/api/v1/workspaces/aed86386-2ed8-424e-934b-ca7a0ef6af37/invites \
  -H 'content-type: application/json' \
  -d '{"email":"qa-duplicate@bunkai.io","role":"member"}'

# 2. Create second invite for SAME email
curl -X POST https://staging-upexbunkai.vercel.app/api/v1/workspaces/aed86386-2ed8-424e-934b-ca7a0ef6af37/invites \
  -H 'content-type: application/json' \
  -d '{"email":"qa-duplicate@bunkai.io","role":"admin"}'
```

### Actual (BUG): Both return 201

```
Request 1: 201 Created — invite ID 684decf8-..., role=member, status=pending
Request 2: 201 Created — invite ID e2e6b5ca-..., role=admin,  status=pending
```

Two pending invites for same email coexist.

### Expected: Second request → 409

```json
{
  "error": "INVITE*ALREADY*PENDING",
  "message": "An invite is already pending for this email address"
}
```

### DB Evidence

Two rows in workspace_invites for same email:

```sql
SELECT id, email, role, status, expires_at
FROM workspace_invites
WHERE workspace_id = 'aed86386-2ed8-424e-934b-ca7a0ef6af37'
  AND email = 'qa-duplicate@bunkai.io'
  AND status = 'pending';
-- 2 rows returned (both pending)
```

### Root Cause

No `UNIQUE (workspace_id, lower(email)) WHERE status = 'pending'` partial index. No application-level pre-check.

---

### Automation for Jira - 10/6/2026, 23:24:37

🔎 Pull Request created. Task is pending to ANALYZE and REVIEW by the team. Waiting for PR Approval.

---

### Automation for Jira - 10/6/2026, 23:24:46

✅ Pull Request is successfully MERGED. Task is Done.

---

### Ely - 10/6/2026, 23:28:06

## 🔧 Bug Fix Documentation

### Root Cause Analysis

***Category******:*** Code Error
***Location******:*** `app/api/v1/workspaces/[id]/invites/route.ts` — POST handler

No check against existing PENDING invites — every POST inserted a new row, so the same email could accumulate multiple live tokens (even with different roles).

### Fix Applied

POST now returns ***409 ****`invite*already*pending` ("A pending invite already exists for this email.") when a live invite exists for the (workspace, email) pair. ****Pending*** = not accepted, not revoked, not expired — expired or revoked invites do NOT block re-inviting.

***PR******:**** https://github.com/upex-galaxy/upex-bunkai-tms/pull/34 (merged to `staging`, commit `8c67211`, deployed) · ****Fix Type******:*** Bugfix · Gates: `bun test` 192/192 (8 new unit tests), `tsc` clean, `eslint` clean.

### Verification Performed (staging, post-deploy)

- [x] Fresh email → 201 · same email again (different role) → ***HTTP 409 ***`invite*already*pending` (was 201+201)
- [x] Revoke the pending invite → re-invite same email → ***201*** (revoked rows do not block — regression guard)
- [x] All smoke invites revoked afterwards (no residue)

### How to Verify

1. POST an invite for a fresh email → 201
2. POST again, same email → ***Expected******:****** 409 ***`invite*already*pending`
3. Revoke it (DELETE `/invites/{inviteId}`) → POST again → ***Expected******:****** 201***

---

**Fix ready for QA verification.**

---

### Nahuel Gomez - 11/6/2026, 1:22:09

## QA Retest: PASSED ✓

***Retest date***: 2026-06-10
***Environment***: staging

### Verification
First invite for bk5-test-qa@bunkai.io (role=member) → 201 ✓
Second invite for same email (role=admin) → 409 "A pending invite already exists for this email." ✓

Duplicate pending invites are now correctly rejected at the application level.

### Evidence
- 1st POST → 201 + invite created
- 2nd POST → 409, error code: conflict, reason: invite*already*pending

### Verdict
Bug fixed. Transitioning to Closed.

---

### Ely - 26/6/2026, 5:00:20

## 🤖 Curación de campos QA (estándar Bunkai)

Curación automática de campos QA según el estándar Bunkai. Justificación:

| Campo | Valor aplicado | Justificación |
| --- | --- | --- |
| Componente | Tenancy & Identity | Defecto en el flujo de invitaciones a workspace (invites duplicados), dominio de Identidad y Tenencia. Epic original BK-1 mapea a este componente. |
| Epic padre | BK-183 (Defect Management) | Reparentado al epic de gestión de defectos. |
| Test Environment | Staging | Reportado en staging (sprint-testing BK-5). |
| Severity | Mayor | Funcionalidad importante rota (se permiten dos invitaciones pendientes para el mismo email); riesgo de race-invite y aceptación de rol no intencionado. No hay pérdida de datos directa, por lo que no es Crítica. |
| Priority | High | Alineada a Severity Mayor. |
| Error Type | Functional | Falta de control de unicidad a nivel aplicación. |
| Root Cause | Code Error | Causa establecida: sin constraint único `(workspace_id, lower(email))` ni verificación de aplicación antes del insert. |

Ningún campo quedó en blanco.

---


_Synced from Jira by sync-jira-issues_
