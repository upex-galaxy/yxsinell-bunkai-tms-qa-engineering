# Bug Report Format Reference

> Reference-only guide. Per-ticket Bug/Defect files are synced from Jira; do not fill this file for a real bug.

## Canonical Shape

```text
[Feature/Area] short observable failure
```

## Required Sections

| Section | Purpose |
|---|---|
| Summary | One-line failure, user-visible. |
| Environment | Where the issue was observed. |
| Preconditions | Data/session/state required before repro. |
| Steps to Reproduce | Numbered, deterministic steps. |
| Expected Result | What should happen. |
| Actual Result | What happened. |
| Evidence | Screenshots, trace, video, logs, request/response. |
| Impact | User/business risk and affected population. |
| Severity | Impact-based severity. |
| Workaround | Temporary unblock path, if any. |
| Regression Signal | Worked before, never worked, or unknown. |
| Links | Source Story, Test Execution, Run, related issues. |

## Environment Table

| Field | Example |
|---|---|
| Environment | `staging` |
| URL | `https://staging-upexbunkai.vercel.app` |
| Browser | Chromium / Firefox / WebKit |
| User Role | owner / admin / member / viewer |
| Data Scope | workspace, project, module, story |
| Date/Time | ISO timestamp |

## Severity Guide

| Severity | Criteria | Example |
|---|---|---|
| Critical | System down, data loss, security breach, no workaround | Cannot login; cross-workspace data leak |
| High | Major feature broken, blocked user path, no practical workaround | Cannot create ATC/Test/Run |
| Medium | Feature impaired, workaround exists | Reorder conflict UX broken but save still possible |
| Low | Cosmetic or minor friction | Copy, alignment, non-blocking visual issue |

## Jira Field Mapping

| Content | Jira Source |
|---|---|
| Actual Result | `{{jira.actual_result}}` or fallback comment |
| Expected Result | `{{jira.expected_result}}` or fallback comment |
| Severity | `{{jira.severity}}` or fallback comment |
| Error Type | `{{jira.error_type}}` or fallback comment |
| Test Environment | `{{jira.test_environment}}` or fallback comment |
| Evidence | `{{jira.evidence}}` or fallback comment |
| Workaround | `{{jira.workaround}}` or fallback comment |
| Root Cause | `{{jira.root_cause}}` or fallback comment |

## Classification Rule

| Label | Use When |
|---|---|
| Bug | Feature is already live above Staging. |
| Defect | Feature is still pre-release. |
| Improvement | Not broken AC; enhancement or under-specified behavior surfaced by testing. |

## Discovery Gaps

- [ ] Live Jira defect workflow and required fields not validated in Phase 4.
- [ ] Components/product modules available in Jira not verified live.
