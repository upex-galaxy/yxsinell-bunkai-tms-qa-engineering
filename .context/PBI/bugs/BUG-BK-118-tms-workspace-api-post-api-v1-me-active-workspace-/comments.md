# Comments for BK-118

[View in Jira](https://jira.upexgalaxy.com/browse/BK-118)

---

### Ely - 26/6/2026, 5:01:09

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componentes | Account & Settings · Project & Module Hierarchy | Se conservan los componentes existentes: el endpoint POST /api/v1/me/active-workspace afecta la configuración de workspace activo del usuario y el contexto de workspace. |
| Épica padre | BK-183 (Defect Management) | Reparentado al épica de gestión de defectos según estándar. |
| Severidad | Menor (ajustada desde Moderada) | El propio Impact indica "Additive — no current consumer is broken": limpieza de contrato sin ruptura. Severidad realineada a impacto real. |
| Prioridad | Low (ajustada desde Highest) | Highest no correspondía a un cambio sin impacto en consumidores; alineada a severidad Menor. |
| Tipo de error | Functional | Campos legacy ({ok, active*workspace*id}) presentes de más en la respuesta de la API. |
| Causa raíz | Code Error | El fix de BK-83 no removió los campos legacy en route.ts (limpieza incompleta en código). |
| Entorno | Staging | Observado en staging (2026-06-12). |
| Frecuencia | (sin cambios) | Campo no tocado por política. |

---


_Synced from Jira by sync-jira-issues_
