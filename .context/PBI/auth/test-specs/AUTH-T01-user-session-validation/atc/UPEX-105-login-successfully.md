# ATC Spec: UPEX-105 — Login Successfully via UI

> **Ticket**: [UPEX-105](https://your-org.atlassian.net/browse/UPEX-105)
> **Component**: `LoginPage` (`tests/components/ui/LoginPage.ts`)
> **Type**: UI — Happy path
> **Parent Story**: UPEX-100 (Validate User Session Management)

---

## 1. Resumen del Test Case

| Field | Value |
|---|---|
| **Name** | Login with valid credentials via UI |
| **Objective** | Valida que completar el formulario login y enviarlo redirige al usuario fuera de login page |
| **Precondition** | Existe test user válido; browser navegado a `/login` vía `goto()` |
| **Acceptance Criteria** | Submit del formulario con credenciales válidas redirige fuera de `/login` |

---

## 2. Contrato ATC

```typescript
/**
 * ATC: Login with valid credentials - expects success
 *
 * IMPORTANT: Call goto() before this ATC.
 * Fills credentials, submits, and verifies redirect away from login page.
 *
 * Fixed assertions:
 * - Page URL no longer contains /login (redirect happened)
 */
@atc('PROJ-101')
async loginSuccessfully(credentials: LoginCredentials): Promise<void>
```

### Method Signature

| Aspect | Value |
|---|---|
| **Name** | `loginSuccessfully` |
| **Parameters** | `credentials: LoginCredentials` (email + password) |
| **Return Type** | `Promise<void>` (UI ATCs siempre retornan void) |

---

## 3B. Detalles UI

### Page Navigation

| Aspect | Value |
|---|---|
| **Page Path** | `/login` |
| **Requires Auth** | No (login page es pública) |
| **Navigation Method** | `await this.goto()` (llamar antes del ATC) |

### Return Type

```typescript
Promise<void>
```

### Estrategia de Locators

```typescript
// Inline locators — used via private helper fillAndSubmitLoginForm()
this.page.locator('[data-testid="login-email-input"]')
this.page.locator('[data-testid="login-password-input"]')
this.page.locator('[data-testid="login-submit-button"]')
```

| Locator | Strategy | Selector | Used In |
|---|---|---|---|
| Email input | `data-testid` | `login-email-input` | Shared (helper) |
| Password input | `data-testid` | `login-password-input` | Shared (helper) |
| Submit button | `data-testid` | `login-submit-button` | Shared (helper) |

### Playwright Assertions

```typescript
// Wait for redirect away from login page
await this.page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
await expect(this.page).not.toHaveURL(/.*\/login.*/);
```

---

## 4. División de Assertions

### Fixed Assertions (dentro del ATC)

| # | Assertion | Code |
|---|---|---|
| 1 | Esperar redirect de URL | `await this.page.waitForURL(url => !url.pathname.includes('/login'))` |
| 2 | Confirmar que no sigue en login page | `await expect(this.page).not.toHaveURL(/.*\/login.*/)` |

### Test-Level Assertions (en Test File)

| # | Assertion | Por qué es test-level |
|---|---|---|
| 1 | Destination URL coincide con página esperada | Depende del routing de app (dashboard, home, etc.) |
| 2 | Dashboard content visible | Específico del estado UI post-login |
| 3 | User name visible en header | Depende de datos del test user |

---

## 5. Code Template

```typescript
// In: tests/components/ui/LoginPage.ts

// ============================================
// Helpers (Private)
// ============================================

/**
 * Fill login form and submit
 * Helper that combines fill + submit actions
 */
private async fillAndSubmitLoginForm(credentials: LoginCredentials): Promise<void> {
  await this.page.locator('[data-testid="login-email-input"]').fill(credentials.email);
  await this.page.locator('[data-testid="login-password-input"]').fill(credentials.password);
  await this.page.locator('[data-testid="login-submit-button"]').click();
}

// ============================================
// ATCs - Complete Test Cases
// ============================================

/**
 * ATC: Login with valid credentials - expects success
 *
 * IMPORTANT: Call goto() before this ATC.
 * Fills credentials, submits, and verifies redirect away from login page.
 */
@atc('PROJ-101')
async loginSuccessfully(credentials: LoginCredentials): Promise<void> {
  await this.fillAndSubmitLoginForm(credentials);

  // Wait for authentication to complete and redirect
  await this.page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
  await expect(this.page).not.toHaveURL(/.*\/login.*/);
}
```

**Uso en test file:**

```typescript
// In: tests/e2e/auth/login.test.ts

test('should login and see dashboard', async ({ ui }) => {
  await ui.login.goto();
  await ui.login.loginSuccessfully({
    email: config.testUser.email,
    password: config.testUser.password,
  });

  // Test-level assertions
  await expect(ui.login.page).toHaveURL(/.*dashboard.*/);
  await expect(ui.login.page).toHaveTitle(/Dashboard/);
});
```

---

## 6. Equivalence Partitioning Check

| Input Variation | Expected Output | Same ATC? |
|---|---|---|
| Valid email + valid password | Redirect fuera de /login | Yes — Base case |
| Different valid user | Redirect fuera de /login | Yes — mismo output, parameterize |
| Invalid email | Error visible, permanece en /login | No — `loginWithInvalidCredentials` (UPEX-106) |
| Valid email + wrong password | Error visible, permanece en /login | No — `loginWithInvalidCredentials` (UPEX-106) |

**Decision**: un ATC para todas las combinaciones de login válido (mismo output: redirect). ATC separado (`loginWithInvalidCredentials`) para combinaciones inválidas (mismo output: error + permanece en page).

---

## 7. Dependencies

### Precondition Steps

| Step | How | Component |
|---|---|---|
| Navegar a login page | `await ui.login.goto()` | `LoginPage` |

### Required Components

| Component | Exists? | Action Needed |
|---|---|---|
| `LoginPage` | Yes | Method ya existe |
| `UiFixture` | Yes | Ya registrado |

---

## 8. Checklist

- [x] Method name sigue convención `{verb}{Resource}{Scenario}`.
- [x] Parameters: 1 posicional (bajo límite max 2).
- [x] Return type es `Promise<void>` (UI ATC).
- [x] Fixed assertions validan invariantes de éxito (URL redirect).
- [x] Test-level assertions documentadas para test file.
- [x] No duplica ATC existente (equivalence partitioning revisado).
- [x] Locators usan `data-testid` (best practice).
- [x] Component placement determinado (`LoginPage` existente).
- [x] Precondition steps identificados (`goto()`).
- [x] Private helper extrae interacción compartida del form.

---

## Cross-References

- **Companion ATC**: UPEX-106 (`loginWithInvalidCredentials`) — mismo componente, negative path.
- **Component**: `tests/components/ui/LoginPage.ts`
- **E2E test**: `tests/e2e/dashboard/dashboard.test.ts`
- **Guidelines**: skill `/test-automation` -- `references/test-design-principles.md`
