# {Module Name} - Roadmap de Automatización de Tests

> **Module**: {Module Name} (`/{route-path}`)
> **Total Tickets**: {count}
> **Total Items**: {n} TCs + {n} Test Scenarios = {total}
> **Created**: {date}
> **Master Document**: [{module}-test-plan.md](../{module-name}-test-plan.md)

---

## Vista General del Roadmap

```
PHASE 1: {Phase Name} (P0)                          PHASE 2: {Phase Name} (P1)
───────────────────────                              ───────────────────────
 {MODULE}-T01  {Title}         ({n} TC + {n} TS)      {MODULE}-T04  {Title}         ({n} TC)
 {MODULE}-T02  {Title}         ({n} TC)                {MODULE}-T05  {Title}         ({n} TC)
 {MODULE}-T03  {Title}         ({n} TC + {n} TS)

                                                     PHASE 3: {Phase Name} (P2)
                                                     ───────────────────────
                                                      {MODULE}-T06  {Title}         ({n} TC + {n} TS)
```

---

## Índice de Tickets

| Ticket | Title | Priority | Phase | TCs | TSs | Dependencies |
|---|---|---|---|---|---|---|
| [{MODULE}-T01]({MODULE}-T01-{slug}.md) | {title} | P0 | 1 | {n} | {n} | None |
| [{MODULE}-T02]({MODULE}-T02-{slug}.md) | {title} | P0 | 1 | {n} | {n} | {MODULE}-T01 |
| [{MODULE}-T03]({MODULE}-T03-{slug}.md) | {title} | P0 | 1 | {n} | {n} | {MODULE}-T01 |
| [{MODULE}-T04]({MODULE}-T04-{slug}.md) | {title} | P1 | 2 | {n} | {n} | {MODULE}-T02 |
| [{MODULE}-T05]({MODULE}-T05-{slug}.md) | {title} | P1 | 2 | {n} | {n} | {MODULE}-T01 |
| [{MODULE}-T06]({MODULE}-T06-{slug}.md) | {title} | P2 | 3 | {n} | {n} | {MODULE}-T01, {MODULE}-T04 |

---

## Resumen por Phase

| Phase | Priority | Tickets | TCs | TSs | Total | Focus |
|---|---|---|---|---|---|---|
| **Phase 1** | P0 | {n} | {n} | {n} | {n} | {focus description} |
| **Phase 2** | P1 | {n} | {n} | {n} | {n} | {focus description} |
| **Phase 3** | P2 | {n} | {n} | {n} | {n} | {focus description} |
| **Total** | | **{n}** | **{n}** | **{n}** | **{n}** | |

---

## Diferencia TC vs Test Scenario

| Type | Definition | Example |
|---|---|---|
| **TC (ATC)** | Atómico: 1 acción de usuario → 1 conjunto de resultados esperados. Reutilizable como componente. | `{verbResourceScenario}` → resultado verificable único |
| **Test Scenario (TS)** | Flujo: encadena múltiples TCs/actions para validar un comportamiento más amplio. | Action A → observe → Action B → verify transition |

---

## Grafo de Dependencias

```
{MODULE}-T01 ({Title}) ←── Foundation for everything
  │
  ├── {MODULE}-T02 ({Title})
  │     └── {MODULE}-T04 ({Title})
  │
  ├── {MODULE}-T03 ({Title})
  │     └── {MODULE}-T05 ({Title})
  │
  └── {MODULE}-T06 ({Title})
```

---

## Tracker de Progreso

| Ticket | Backlog | In Progress | PR | Merged |
|---|---|---|---|---|
| {MODULE}-T01 | [ ] | [ ] | [ ] | [ ] |
| {MODULE}-T02 | [ ] | [ ] | [ ] | [ ] |
| {MODULE}-T03 | [ ] | [ ] | [ ] | [ ] |
| {MODULE}-T04 | [ ] | [ ] | [ ] | [ ] |
| {MODULE}-T05 | [ ] | [ ] | [ ] | [ ] |
| {MODULE}-T06 | [ ] | [ ] | [ ] | [ ] |
