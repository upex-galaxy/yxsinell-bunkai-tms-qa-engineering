# User Story Format Reference

> Reference-only guide. Per-ticket Story files are synced from Jira by `/sprint-testing`; do not fill this file for a real ticket.

## Canonical Shape

```text
As a [persona]
I want to [action]
So that [business benefit]
```

## Required Sections

| Section | Purpose |
|---|---|
| Summary | One-line business outcome. |
| Persona / Role | Who needs the capability. |
| Business Value | Why this matters. |
| Scope | What is included. |
| Out of Scope | What is explicitly excluded. |
| Acceptance Criteria | Testable Given/When/Then criteria. |
| Business Rules | Domain constraints that must always hold. |
| Workflow | User/system path through the feature. |
| Mockup / Links | Design or reference links. |
| Dependencies | Blocking stories, APIs, data, external systems. |

## Acceptance Criteria Skeleton

```gherkin
AC1: [short criterion name]
Given [initial state]
When [user or system action]
Then [observable result]

AC2: [short criterion name]
Given [initial state]
When [user or system action]
Then [observable result]
```

## AC Checklist

- [ ] Specific and measurable.
- [ ] Testable through UI, API, DB, or observable system output.
- [ ] Business-focused, not implementation-only.
- [ ] Independent enough to fail without hiding other criteria.
- [ ] Includes negative/edge behavior where business-critical.

## Jira Field Mapping

| Content | Jira Source |
|---|---|
| Acceptance Criteria | `{{jira.acceptance_criteria}}` or fallback comment `## Acceptance Criteria` |
| Business Rules | `{{jira.business_rules_specification}}` or fallback comment |
| Scope | `{{jira.scope}}` or fallback comment |
| Out of Scope | `{{jira.out_of_scope}}` or fallback comment |
| Workflow | `{{jira.workflow}}` or fallback comment |
| Mockup | `{{jira.mockup}}` |
| Implementation Plan | `{{jira.spec_implementation_plan}}` or fallback comment |

## Discovery Gaps

- [ ] Live Jira required-field/create-meta validation not performed in Phase 4.
- [ ] Team-specific Story workflow states not verified live.
