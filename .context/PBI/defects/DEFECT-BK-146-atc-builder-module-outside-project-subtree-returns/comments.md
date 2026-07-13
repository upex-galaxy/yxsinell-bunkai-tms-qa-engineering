# Comments for BK-146

[View in Jira](https://jira.upexgalaxy.com/browse/BK-146)

---

### Ely - 26/6/2026, 4:59:42

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componente | ATC Library (Acceptance Test Cases) | Defecto en POST /api/v1/atcs (creación de ATC, historia BK-19). Sin Epic Link previo: inferido del contenido. |
| Epic padre | BK-183 (Defect Management) | Reparentado a gestión de defectos. |
| Entorno de prueba | Staging | Indicado en la descripción. |
| Severidad | Moderada | El endpoint devuelve 404 en vez de 422 module*outside*project_subtree, confundiendo "no existe" con "pertenece a otro proyecto"; impide mensaje específico. Sin workaround claro, función accesible. |
| Prioridad | Medium | Alineada a Severidad Moderada. |
| Tipo de error | Functional | Contrato de la API: código de estado incorrecto en la respuesta. |
| Causa raíz | Code Error | El servidor responde 404 not_found en lugar del 422 esperado; lógica de validación/respuesta en el código. |

---

### maibeth vega - 6/7/2026, 4:18:58

## BK-146 — Verification: FIXED ✅

***Verified on******:**** 2026-07-06 | ****Environment******:**** Staging | ****Tester******:*** maibeth vega

### Test Executed

```
POST /api/v1/atcs
module_id: 6a86c5d8-5fec-4b0e-ac89-3536a88a1dd7  (module from different workspace)
title: "BK-146 cross module"
layer: API
steps: [{ position: 1, content: "Send GET /health", expected_result: "200 OK" }]
user*story*id: a3a53a57-bf9d-4241-b5cf-35c3373a17ad
acceptance*criterion*ids: [9b9beca6-fb5c-4334-963f-16aacf34a383]
```

### Result

| Before (bug) | After (fixed) |
| --- | --- |
| HTTP 404 `not*found` | ***HTTP 422 ***`module*outside*project*subtree` |

***Response******:***

```json
{
  "error": {
    "code": "module*outside*project_subtree",
    "message": "The module must be the user story's module or a descendant in the same project.",
    "details": { "reason": "module*outside*project_subtree" }
  }
}
```

The server now correctly distinguishes between "module doesn't exist" (404) and "module belongs to a different project subtree" (422), enabling the UI to show a specific, actionable error message.

---


_Synced from Jira by sync-jira-issues_
