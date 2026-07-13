# Comments for BK-185

[View in Jira](https://jira.upexgalaxy.com/browse/BK-185)

---

### Benjamin Segovia - 13/7/2026, 15:33:03

## Dev hand-off

***Context******:**** filed during the BK-23 (Duplicate ATC) sprint-testing session (2026-06-26 → 2026-06-28). Result was ****FAILED → BLOCKED*** — this is one of the two defects blocking that story's QA sign-off, the other being BK-184.

***What's missing******:*** the ATC Library has no "Duplicate" action anywhere in the staging UI — no entry point for the user to trigger the feature described in BK-23, even though the story's backend contract (`POST /atcs/{source_id}/duplicate`) was designed and agreed with the architect.

***Ask******:*** implement the UI entry point (button/menu action on the ATC list/detail view) that calls the duplicate endpoint and redirects to the new ATC's detail page, per BK-23's spec.

***Next step once fixed******:*** BK-23 Stage 2 (execution) gets re-run alongside BK-184's fix — flagging both together since they block the same retest.

---


_Synced from Jira by sync-jira-issues_
