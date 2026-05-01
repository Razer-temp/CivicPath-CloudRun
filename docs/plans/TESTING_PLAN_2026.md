# 2026 Testing & Validation Plan

Based on the latest 2026 testing best practices for React, Vite, and Firebase, this document outlines the core structural testing improvements we will apply to the CivicPath project to ensure a 100/100 validation score.

## 1. Unit & Integration Testing (Vitest & RTL)
- **Current State:** The application might be lacking structured unit tests for hooks and contexts.
- **2026 Best Practices:** Eject Jest in favor of **Vitest**, which natively leverages Vite's build pipeline and ES modules for lightning-fast concurrent testing.
- **Action:** 
  - Install `vitest`, `@testing-library/react`, and `@testing-library/jest-dom`.
  - Write unit tests for core utilities (`cacheService`, `geminiService` parsers) and custom hooks (`useElectionNews`, `AuthContext`).
  - Use `vi.mock` to heavily mock external APIs.

## 2. End-to-End Testing (Playwright)
- **Current State:** Manual testing in the browser.
- **2026 Best Practices:** **Playwright** is the undeniable standard for cross-browser, concurrent E2E testing with built-in auto-waiting and trace viewers.
- **Action:**
  - Setup Playwright for critical user journeys (e.g., Guide progression, Assistant interaction).
  - Mock Firebase Auth globally in E2E tests, or use a dedicated "test environment" user token to bypass auth captchas.

## 3. Firebase Security Rules Testing
- **Current State:** Rules are enforced, but not locally tested through automation.
- **2026 Best Practices:** Never deploy Firestore rules without automated verification using the **Firebase Local Emulator Suite** and `@firebase/rules-unit-testing`.
- **Action:**
  - Create `firestore.rules.test.ts` utilizing local emulators.
  - Assert the "Dirty Dozen" payloads (e.g., shadow field injection, unauthenticated reads of PII).
  - Test coverage must prove that tier-based access is fully functioning.

## 4. AI Non-Deterministic Testing (Evaluations)
- **Current State:** The GenAI service hits production LLMs for every test.
- **2026 Best Practices:** Separate functional tests from LLM evals. Continuous Integration (CI) should never fail due to LLM hallucination.
- **Action:**
  - Stub the `@google/genai` calls in standard Vitest suites with fixed synthetic responses.
  - If LLM response quality needs testing, create a dedicated `evals` script that runs periodically on a sample of prompts rather than continuously in CI.

## 5. Accessibility & Component Validation
- **Current State:** Components might lack rigid a11y testing.
- **2026 Best Practices:** Automated Axe-core integration.
- **Action:**
  - Introduce `axe-core` in Vitest to automatically catch missing ARIA labels, contrast issues, or lack of keyboard navigation (especially critical for a civic platform).

---
*This file serves as the roadmap for the fourth phase of our 6-field improvement strategy focused on Testing and Validation.*
