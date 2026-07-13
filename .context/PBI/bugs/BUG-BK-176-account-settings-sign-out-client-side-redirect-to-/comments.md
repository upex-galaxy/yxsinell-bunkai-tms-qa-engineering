# Comments for BK-176

[View in Jira](https://jira.upexgalaxy.com/browse/BK-176)

---

### Andrés Daniel Cumare Morales - 23/6/2026, 11:33:54

Bug found during exploratory testing of BK-86 (Account | View my identity, role, and sign out). Sign-out server-side invalidation works, but client-side redirect to /login does not fire.

---

### Ely - 26/6/2026, 4:59:43

## 🤖 Curación de campos QA (estándar Bunkai)

| Campo | Valor | Justificación |
| --- | --- | --- |
| Componente | Account & Settings | El sign-out desde el menú de cuenta (AppSidebar) corresponde a cuenta/sesión del usuario. Historia relacionada BK-86. Sin Epic Link previo: inferido del contenido. |
| Epic padre | BK-183 (Defect Management) | Reparentado a gestión de defectos. |
| Entorno de prueba | Staging | Indicado en la descripción. |
| Severidad | Menor | La sesión SÍ se invalida server-side (204); solo falla el redirect visual. Impacto UX, no de seguridad ni funcional. |
| Prioridad | Low | Alineada a Severidad Menor. |
| Tipo de error | Functional | El redirect cliente a /login no se ejecuta tras el sign-out. |
| Causa raíz | EN BLANCO (flag) | El ticket solo plantea hipótesis ("race entre limpieza de cookie y navegación RSC", "router.refresh() podría cortocircuitar el push"). Sin evidencia concluyente del mecanismo exacto; se deja en blanco para no inventar. |

---


_Synced from Jira by sync-jira-issues_
