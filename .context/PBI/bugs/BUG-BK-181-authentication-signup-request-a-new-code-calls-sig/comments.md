# Comments for BK-181

[View in Jira](https://jira.upexgalaxy.com/browse/BK-181)

---

### Ely - 26/6/2026, 4:59:45

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componente | Tenancy & Identity | Pantalla de verificación de email del signup (flujo de auth BK-166). Sin Epic Link previo: inferido del contenido. |
| Epic padre | BK-183 (Defect Management) | Reparentado a gestión de defectos. |
| Entorno de prueba | Staging | Indicado en la descripción. |
| Severidad | Mayor | Conservada. "Request a new code" no funciona: el usuario que necesita un código nuevo no puede obtenerlo (intención de reenvío rota) y se filtra un mensaje técnico crudo (info-disclosure menor). |
| Prioridad | High | Alineada a Severidad Mayor. |
| Tipo de error | Functional | Conservado. El control llama al endpoint equivocado (signup en vez de resend). |
| Causa raíz | Code Error | El control está cableado a POST /api/v1/auth/signup en lugar de un endpoint de reenvío, y no envuelve el error de validación; lógica de frontend incorrecta. |

---

### Benjamin Segovia - 13/7/2026, 15:33:18

## Dev hand-off

***Context******:*** found incidentally while probing BK-23's staging-login blocker (BK-175) — not part of a dedicated test session, so it hasn't been confirmed whether it blocks signup completion entirely or only the resend convenience action.

***What's wrong******:*** on the email-verification screen of the signup flow (BK-166), "Request a new code" calls `POST /api/v1/auth/signup` again instead of a resend-verification endpoint. That call fails with a 422, and the raw backend validation message (`"Request body failed validation."` / field-level details) is rendered verbatim in the UI alert instead of a user-friendly resend confirmation or error.

***Impact******:*** users needing a fresh code (e.g. expired original) can't get one through this control. The raw validation text in a user-facing alert is also a minor info-disclosure smell (exposes internal field/validation naming).

***Ask******:*** wire the control to an actual resend-verification endpoint, and wrap any backend validation failure in a user-friendly message before it reaches the UI. Not currently blocking other QA work — pick up when there's room.

---


_Synced from Jira by sync-jira-issues_
