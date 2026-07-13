# Comments for BK-175

[View in Jira](https://jira.upexgalaxy.com/browse/BK-175)

---

### Benjamin Segovia - 22/6/2026, 15:38:41

Check your inbox screen — zero input fields in DOM, OTP code has nowhere to be entered



---

### Benjamin Segovia - 22/6/2026, 18:06:00

## Root cause confirmed (live verification, 2026-06-22 16:01 UTC)

Pulled the actual OTP email via the Resend receiving API (`resend emails receiving get`) for the staging test inbox `bunkai-staging-userbunk@olkacoraug.resend.app`.

***Email content******:***

```
Confirm your Bunkai account
Enter this 6-digit code to verify your email:

49342534

This code expires in 10 minutes.
```

The only link in the email body is "Opt out of these emails" — there is no sign-in/confirmation link anywhere.

### Diagnosis

- `app/(auth)/login/magic-link-form.tsx` implements a pure click-the-link flow: after submit it renders "Check your inbox — A sign-in link was sent to `{email}`", with no code-entry input anywhere in the component.
- Supabase Auth is configured to send an ***OTP-code-only*** email template for this flow — no magic-link URL is ever generated.
- Frontend and email-template contract are mismatched: the UI promises a link, the email delivers a code.

### Secondary bug found in the same email

The copy says "6-digit code" but the actual code is ***8 digits*** (`49342534`). Same class of bug already fixed in BK-166 (`OTP_REGEX` relaxed from `\d{6}` to `\d{6,8}` in `email-first-form.tsx`) — but that fix only touched the new password-flow form. This magic-link path and its email template were not touched and still says "6-digit".

### Suggested fix directions (either resolves BK-23's blocker)

1. Switch the Supabase email template for this flow back to a clickable magic-link URL (matches what the frontend already expects), ***or***
2. Add a code-entry input to `magic-link-form.tsx` (mirroring the already-fixed OTP input in `email-first-form.tsx`) and correct the email copy to say "8-digit code".

---

### Ely - 26/6/2026, 4:55:53

## 🤖 Curación de campos QA (estándar Bunkai)

Campos revisados y completados de forma automatizada como parte del estándar de clasificación de incidencias:

| Campo | Valor | Justificación |
| --- | --- | --- |
| ***Component*** | Tenancy & Identity | El defecto vive en el flujo de autenticación (magic-link / OTP de login), que pertenece al boundary de identidad. |
| ***Épica*** | BK-183 Defect Management | Reparentado: todas las incidencias de tipo defecto se agrupan bajo Defect Management. El módulo queda reflejado en Component. |
| ***Test Environment*** | Staging | Reproducido en `staging-upexbunkai.vercel.app` según el reporte. |
| ***Severity*** | Crítica | Bloquea el 100% del login en staging → impide toda QA dependiente del entorno. |
| ***Priority*** | Highest | Alineada a Severity Crítica. |
| ***Error Type*** | Functional | Falta el campo de entrada del OTP; el comportamiento funcional está roto, no es visual ni de contenido. |
| ***Root Cause**** | **(en blanco)** | Sin evidencia concluyente: el reporte indica que la causa está "likely" en el componente de la vista post-submit ****y/o*** en la plantilla de email de Supabase Auth. No se determina si es Code Error o Configuration Error sin diagnóstico de desarrollo → se deja vacío para no inventar. |

> Frequency se omite (campo en desuso en el proyecto).

---

### Benjamin Segovia - 13/7/2026, 15:32:56

> ***ERROR:**** ****CRITICAL — blocks all staging QA work.*** This is the top-priority item across the current QA queue and should be picked up before anything else.

## Dev hand-off

***Impact******:*** No manual or automated QA can validate any staging deployment until this is fixed. Currently blocking BK-23 (Duplicate ATC) verification, and will block every future staging-dependent test session until resolved.

***Root cause area (from investigation)******:*** the post-submit "Check your inbox" confirmation screen renders zero input fields, so the 6-digit OTP code sent by Supabase Auth has nowhere to be entered. Likely the confirmation view component and/or the Supabase Auth email template configuration — reproduced twice with independent OTP emails, identical result both times.

***Ask******:*** please prioritize this over other in-flight work — every other open QA ticket in this queue is secondary to unblocking staging login.

---


_Synced from Jira by sync-jira-issues_
