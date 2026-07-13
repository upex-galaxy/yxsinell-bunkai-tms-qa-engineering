# Comments for BK-97

[View in Jira](https://jira.upexgalaxy.com/browse/BK-97)

---

### Ely - 21/6/2026, 21:01:53

Consolidating BK-168 into this ticket (duplicate). Scope from BK-168:

Audit and enforce capability scopes across non-ATC write endpoints. The ATC domain enforces capabilities via requires:[] on withApiHandler (~10 routes); non-ATC writes (projects, environments, modules, user stories, acceptance criteria, tests beyond search — ~15-20 routes) have NO capability gate, relying on RLS + workspace_members role checks only. A PAT is therefore not constrained by its scopes outside the ATC domain.

Design-first: audit which operation needs which scope; decide whether new scopes are needed (e.g. projects:write) or the existing vocabulary suffices; apply requires:[] gates + the assertWorkspaceContext workspace_id match (lib/api/principal.ts, added in BK-167); consolidate the scope vocabulary, currently duplicated in lib/api/pat.ts, lib/api/principal.ts, app/api/v1/tokens/route.ts and migration 0008.

Depends on the enforcement model in ADR-0006 (Accepted) and builds on the issuance fix in ADR-0005 (Accepted, BK-135). The workspace:admin slice was already done in BK-167 (FIXED).

AC:

- Each non-ATC write endpoint has a documented required capability (or a justified exemption); scope vocabulary has a single source of truth.
- A read-scoped PAT calling a non-ATC write endpoint returns 403.

---

### Ely - 26/6/2026, 5:01:06

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componentes | Tenancy & Identity | El alcance es la aplicación de capacidades (scopes) del PAT por ruta; es un asunto de autenticación/identidad de tokens. |
| Épica padre | BK-183 (Defect Management) | Reparentado al épica de gestión de defectos según estándar. |
| Severidad | Moderada | No es fuga cross-tenant (RLS confina al usuario); el PAT solo puede lo que el usuario ya podía. Impacto medio según el propio ticket. |
| Prioridad | Medium | Alineada a severidad Moderada. |
| Tipo de error | Security | Un PAT de scope estrecho conserva más poder del que su scope implica: gap de control de autorización por token. |
| Causa raíz | Code Error | El texto lo establece: las rutas no-ATC migraron con requires:[] y no validan los scopes del token (gap de implementación en código). |
| Entorno | Staging | Trabajo de hardening sobre staging. |
| Frecuencia | (sin cambios) | Campo no tocado por política. |

---


_Synced from Jira by sync-jira-issues_
