# Comments for BK-143

[View in Jira](https://jira.upexgalaxy.com/browse/BK-143)

---

### maibeth vega - 18/6/2026, 22:53:38

## Actual Result

51,200 bytes (true binary KiB = 50 x 1024) rejected with 422 description*too*long. Binary search confirmed: max accepted = 50,000 bytes.

## Expected Result

51,200 bytes (50 x 1024) should be accepted per the documented 50 KB cap.

## Workaround

Keep descriptions under 50,000 bytes.

---

### Ely - 26/6/2026, 5:01:13

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componentes | User Stories & Acceptance Criteria | El defecto está en la validación de descripción de Acceptance Criteria; la épica original era BK-12 (User Stories & AC). |
| Épica padre | BK-183 (Defect Management) | Reparentado al épica de gestión de defectos según estándar. |
| Severidad | Moderada | El cap de bytes rechaza 51.200 bytes válidos, pero existe workaround (mantener < 50.000 bytes). |
| Prioridad | Medium | Alineada a severidad Moderada. |
| Tipo de error | Functional | Límite de validación mal calculado que rechaza entradas válidas. |
| Causa raíz | Code Error | El ticket lo establece: MAX*AC*DESCRIPTION_BYTES usa 50×1000 (KB decimal) en vez de 50×1024 (KiB binario) en validation.ts. |
| Entorno | Staging | TC-25 fallido durante sesión QA de BK-15 en staging (2026-06-18). |
| Frecuencia | (sin cambios) | Campo no tocado por política. |

---

### maibeth vega - 6/7/2026, 4:09:17

## BK-143 — Verification: FIXED ✅

***Verified on******:**** 2026-07-06 | ****Environment******:**** Staging | ****Tester******:*** maibeth vega

### Test Results

| Bytes | Test | HTTP | Result |
| --- | --- | --- | --- |
| 50,000 | Baseline (decimal KB — bug reference) | 201 | ✅ ACCEPTED |
| 51,200 | Binary KiB (50 × 1024 — documented cap) | ***201**** | ✅ ****ACCEPTED — bug is fixed*** |

### Boundary Discovery

Additional boundary testing revealed the application-level byte cap has been removed entirely. Only Vercel's infrastructure payload limit applies:

| Bytes | HTTP | Note |
| --- | --- | --- |
| 51,201 | 201 | Over binary KiB — still accepted |
| 1,000,000 | 201 | 1 MB — still accepted |
| 4,000,000 | 201 | 4 MB — still accepted |
| 4,500,000 | ***413*** | Vercel FUNCTION*PAYLOAD*TOO_LARGE |

### Conclusion

- ***BK-143 FIXED***: `51,200 bytes (50 × 1024)` is now accepted with HTTP 201.
- ***Observation***: The `MAX*AC*DESCRIPTION_BYTES` validation was removed entirely (not corrected to binary KiB). The effective limit is now ~4 MB (Vercel infrastructure cap), not 50 KB or 50 KiB. Whether this is intentional requires PO/Dev confirmation — no new defect filed per scope of this retest.

### Method

```
POST /api/v1/user-stories/{id}/acceptance-criteria
Authorization: Bearer bk*pat**** (QA workspace)
detail: "A" * N bytes
```

No UI changes detected. Validation removal is purely server-side.

---


_Synced from Jira by sync-jira-issues_
