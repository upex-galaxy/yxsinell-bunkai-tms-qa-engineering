# Comments for BK-144

[View in Jira](https://jira.upexgalaxy.com/browse/BK-144)

---

### Ely - 26/6/2026, 4:59:39

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componente | ATC Library (Acceptance Test Cases) | El defecto vive en el ATC builder (input de tags, historia relacionada BK-19). Sin Epic Link previo: componente inferido del contenido. |
| Epic padre | BK-183 (Defect Management) | Reparentado: todos los defectos se consolidan bajo gestión de defectos. |
| Entorno de prueba | Staging | Indicado en la descripción (staging-upexbunkai.vercel.app). |
| Severidad | Menor | La función opera: el 11º tag se rechaza y se muestra mensaje. Solo falta deshabilitar el input / feedback inmediato; impacto cosmético/UX. |
| Prioridad | Low | Alineada a Severidad Menor. |
| Tipo de error | Functional | El input no cambia de estado (enabled) según el comportamiento esperado al alcanzar el tope. |
| Causa raíz | Code Error | El frontend no aplica el estado disabled al llegar al máximo de 10 tags; lógica de UI faltante. |

---

### maibeth vega - 6/7/2026, 4:37:39

***QA Verification (2026-07-06) — Staging: ***STILL OPEN. Behavior changed but bug not fixed.

Steps verified:

1. Open ATC builder at /projects/pruebas/atcs/new
2. Add 10 tags using the tag input (tag1 through tag10)
3. Attempt to type and add an 11th tag

***Observed (current behavior): ***Tag input remains enabled at 10-tag cap. The paragraph message "An ATC can have at most 10 tags." that previously appeared below the input has been removed. The 11th tag is silently not added — zero feedback to the user.

***Expected behavior: ***Input should be disabled at the 10-tag cap OR show immediate inline feedback on 11th attempt.

The fix attempt removed the paragraph message but did not disable the input or provide alternative feedback. The UX regression worsened: previously there was at least a visible message; now there is none. Bug remains open.

---

### maibeth vega - 7/7/2026, 1:13:18

### QA Verification Report — BK-144 (2026-07-06)

Tester: maibethvega | Environment: staging | Method: code analysis

### Overall Result: REGRESSED

Worse than originally described. The 11th tag is now added to state AND saved to the database — no cap enforced at any layer.

### Verification Results

- V-01 addTag() cap guard: ABSENT — no tags.length >= 10 check.
- V-02 input disabled at 10 tags: ABSENT — no disabled prop.
- V-03 11th tag added to state: CONFIRMED — addTag() adds it unrestricted.
- V-04 11+ tags save to DB: REGRESSED — saveAtcAction + bunkai*save*atc accept unlimited tags array.

### Status

Leaving as Abierta — scope expanded, fix required at 3 layers (see updated description). Same pattern as BK-145.

---


_Synced from Jira by sync-jira-issues_
