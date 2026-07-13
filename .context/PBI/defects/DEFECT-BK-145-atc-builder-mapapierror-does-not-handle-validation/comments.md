# Comments for BK-145

[View in Jira](https://jira.upexgalaxy.com/browse/BK-145)

---

### Ely - 26/6/2026, 4:59:41

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componente | ATC Library (Acceptance Test Cases) | Defecto en el ATC builder / mapApiError (historia BK-19). Sin Epic Link previo: inferido del contenido. |
| Epic padre | BK-183 (Defect Management) | Reparentado a gestión de defectos. |
| Entorno de prueba | Staging | Indicado en la descripción. |
| Severidad | Menor | Solo se manifiesta si se omite la validación Zod del cliente (vía API directa); usuarios reales protegidos. Mensaje degradado, no bloqueo. |
| Prioridad | Low | Alineada a Severidad Menor. |
| Tipo de error | Functional | Manejo de error incorrecto: muestra mensaje genérico en vez del de campo. |
| Causa raíz | Code Error | mapApiError no reconoce el patrón validation*failed + too*small (solo title*too*short). Lógica faltante en el utilitario. |

---

### maibeth vega - 6/7/2026, 4:37:18

***QA Verification (2026-07-06) — Staging: ***STILL OPEN. Bug not fixed.

Steps to reproduce:

1. Open ATC builder at /projects/pruebas/atcs/new
2. Set up route mock: POST **/api/v1/atcs → 422 ```]}
3. Fill valid title, module, layer, user story, AC, steps — enable Create ATC button
4. Click Create ATC

***Actual result: ***Generic paragraph error shown: "Request body failed validation." at form level (no field-level error at title input).

***Expected result: ***Field-level error "Title must be at least 3 characters" displayed next to the title input.

mapApiError still does not handle validation*failed + too*small pattern. Console shows HTTP 422 from the intercepted route. Bug confirmed present on staging.

---

### maibeth vega - 7/7/2026, 0:55:59

### QA Verification Report — BK-145 (2026-07-06)

Tester: maibethvega | Environment: staging | Method: code analysis

### Overall Result: REGRESSED

The defect behavior is worse than originally described. A 2-character title saves successfully — no error is shown at any layer.

### Verification Results

- V-01 DB constraint: ABSENT — atcs.title has no CHECK constraint for minimum length.
- V-02 Save button enabled for 2-char title: CONFIRMED — canSave = title.length > 0 passes for length 2.
- V-03 Submit 2-char title: REGRESSED — saveAtcAction + bunkai*save*atc accept and persist the 2-char title.
- V-05 Error display: N/A — no error is produced at any layer.

### Key Findings

- The POST /api/v1/atcs endpoint referenced in the original filing does not exist. ATC saves go through saveAtcAction → bunkai*save*atc (Supabase RPC).
- The mapApiError utility referenced in the original filing does not exist in the codebase.
- Title minimum-length (>=3 chars) is not enforced at DB, RPC, Server Action, or UI layers.

### Status

Leaving as Abierta — bug confirmed and scope expanded. Fix requires 3 changes (see updated description).

---


_Synced from Jira by sync-jira-issues_
