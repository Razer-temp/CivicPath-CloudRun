# MASTER PLAN: ACHIEVING 100/100 IN ALL EVALUATION CATEGORIES (2026 EDITION)

To ensure this CivicPath project achieves a perfect 100/100 score across all six evaluation focus areas, we must implement the most modern 2026 web development paradigms. Below is the comprehensive, step-by-step master plan.

## 1. Code Quality – Structure, Readability, Maintainability
To achieve 100% in Code Quality, the codebase must be predictable, modular, and strictly typed.
- **Strict TypeScript (No `any`):** Run the project with high-tier strictness. All contexts, hooks, and services must have explicit prop/return types.
- **Component Modularity:** Ensure no single file exceeds 300-400 lines. The `Guide.tsx` and `AssistantPage.tsx` must rely on well-defined sub-components.
- **Error Boundaries:** Wrap major route chunks with granular Error Boundaries (e.g., `QuotaErrorBoundary`) so that an isolated failure (like a failed GenAI API call) does not crash the app.
- **Vite Optimization:** Use Vite's chunk splitting configuration so that Firebase SDKs, React, and GenAI SDKs are split into vendor chunks, improving maintainability of the main bundle.

## 2. Security – Safe and Responsible Implementation
A perfect security score in 2026 requires "Zero-Trust" architecture natively.
- **Hardened Firestore Rules:** Implement the "8 Pillars of Hardened Rules" (from our AI Agent's framework).
  - Explicit schema validation in rules using `affectedKeys().hasOnly()`.
  - Block shadow-field attacks by preventing unexpected data keys.
- **Client-Side Auth State Validation:** Do not render private routes until `auth.currentUser` is fully resolved.
- **API Key Protection:** The `GEMINI_API_KEY` must never be exposed to uncontrolled client input. Use strict Prompt Injection resistance in the AI system prompts.

## 3. Efficiency – Optimal Use of Resources
To score 100% in Efficiency, the app must feel instantly responsive, utilizing local resources smartly to minimize network and API costs.
- **Advanced Caching (IndexedDB):** Implement the localCache mechanism (using `idb-keyval`) for AI responses to prevent burning GenAI quota for repeated prompts (already planned/partially done).
- **React Concurrent Features:** Utilize `Suspense` and `lazy` imports for all major routes and heavy components (Guide steps, Chat components).
- **Sub-Resource Integrity & Lazy Loading:** Ensure icons, web fonts, and structural images do not block the main thread.

## 4. Testing – Validation of Functionality
Modern testing standards expect speed and reliability.
- **Vitest & RTL:** Implement unit tests for pure functions, custom hooks, and context providers using Vitest (which is drastically faster than Jest via Vite integration).
- **E2E with Playwright:** Create critical user journey tests (e.g., "User can complete the voting guide and earn stamps") using Playwright, verifying cross-browser functionality.
- **Local Emulators:** Setup `@firebase/rules-unit-testing` to assure that data invariants hold true even against malicious "Dirty Dozen" payloads.

## 5. Accessibility – Inclusive and Usable Design
Accessibility is non-negotiable for a civic app. Achieving 100% means strict WCAG 2.2 AA (or AAA) adherence.
- **Focus Management:** Implement the `<RouteFocusManager />` to guide screen readers on page transitions.
- **Invisible Skip Links:** A "Skip to Main Content" link must exist as the first element in the DOM.
- **High Contrast & Touch Targets:** Ensure all buttons are a minimum of `44px` on mobile screens with high-contrast `focus-visible:ring-2` states for keyboard users.
- **Aria-Live Regions:** Ensure the Gemini Assistant uses `aria-live="polite"` so screen reader users are notified when the AI generates a response.

## 6. Google Services – Meaningful Integration
This category tests how well we leverage the Google ecosystem.
- **Generative AI (`@google/genai`):** Go beyond generic chat. Use Structured Outputs (JSON Schema parsing) for the interactive quizzes in the Guide. Incorporate contextual RAG (Retrieval-Augmented Generation) based on the user's progress.
- **Firebase Ecosystem:** Seamlessly tie Firebase Authentication, Firestore (for saving stamps/progress and user profiles), and Firebase Hosting.
- **Contextual Synergy:** Show that GenAI isn't just a bolt-on. The Assistant should know what step of the guide the user is on and tailor its advice accordingly.

---

### Execution Strategy
We have already created the subset plans (`EFFICIENCY_PLAN_2026.md`, `TESTING_PLAN_2026.md`, `ACCESSIBILITY_PLAN_2026.md`) and have begun integrating their recommendations into `vite.config.ts`, `App.tsx`, `Layout.tsx`, and `AssistantPage.tsx`.

Our next step is to rigorously apply these principles across the UI components, implement the Firestore Rules, add the Vitest suites, and verify code quality with `ESLint`.
