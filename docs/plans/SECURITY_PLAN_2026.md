# 2026 Security & Responsible Implementation Plan

Based on the latest 2026 security best practices (OWASP Top 10 for Frontend, GenAI Security Guidelines, and Firebase strict standards), this document outlines the core structural and qualitative security improvements we will apply to the CivicPath project to ensure a 100/100 security score.

## 1. Firebase Strict Security Rules (The 8 Pillars)
- **Current State:** Firetore rules might be too permissive or relying on client-side logic for data filtering.
- **2026 Best Practice:** Zero-trust architecture. Rules must validate payload shapes, limits, and relationships completely independently of the client.
- **Action:** 
  - Enforce schema validation strictly within `firestore.rules` (e.g., `isValid[Entity]()` checks).
  - Add explicit bounds for arrays, strings, and integer sizes to prevent "Denial of Wallet" resource exhaustion.
  - Implement Tiered Role-Based Access Control (RBAC) ensuring identity matching (`resource.data.userId == request.auth.uid`) on every read/write.
  - Test all changes using `@firebase/rules-unit-testing`.

## 2. GenAI Prompt Injection & Jailbreak Prevention
- **Current State:** Generative API calls to Gemini prompt might accept direct user text without heavy systemic isolation, risking political bias or hallucinated "advice."
- **2026 Best Practice:** Use system directives to strict-box the LLM capability. 
- **Action:** 
  - Wrap all Gemini inputs in bounded prompts. Provide strict behavioral bounds (e.g., "Do NOT express political opinions, biases, or endorse any party").
  - Sanitize all outbound AI generated text rendering by treating AI-generated text as "untrusted." Ensure React's default escaping is used, and if rendering markdown, use a hardened sanitizer like DOMPurify.

## 3. Safe Environment Variables & Secret Management
- **Current State:** The VITE_ prefix exposes variables to the browser.
- **2026 Best Practice:** Never ship private keys to the client payload. Since Gemini SDK uses `process.env.GEMINI_API_KEY` behind a server, ensure no `VITE_` prefix is misused for sensitive keys.
- **Action:** 
  - Validate `.env.example` does not contain real or simulated secrets.
  - Ensure Firebase public config is the only configuration exposed dynamically on the frontend.

## 4. XSS (Cross-Site Scripting) & Content Sanitization
- **Current State:** Rendering raw markdown or AI content directly can expose the app to XSS if not safely handled.
- **2026 Best Practice:** Content Security Policy (CSP) and Strict Sanitization.
- **Action:** 
  - Implement DOM sanitization whenever dealing with dynamically generated markdown (using robust libraries, or ensuring React `<Markdown>` completely escapes arbitrary HTML tags).
  - Remove all inline `dangerouslySetInnerHTML` occurrences unless wrapped in a strict purifier.

## 5. Strict Types (Validation at the Edge)
- **Current State:** Using `any` bypasses both Code Quality and Security.
- **2026 Best Practice:** Zod or strict TypeScript interfaces for all inputs to ensure data poisoning cannot happen.
- **Action:** 
  - Use our newly defined types (e.g., `UserProfile`, `NewsItem`) strictly. If parsing external JSON (like RSS or AI response), validate the shapes before rendering them to the DOM.

## 6. Authentication Security Limits
- **Current State:** Basic Firebase Auth login.
- **2026 Best Practice:** Graceful handling of anonymous & unverified states. Secure handling of error boundaries so no internal stack traces leak.
- **Action:**
  - Wrap the UI using the existing `QuotaErrorBoundary` and `ErrorBoundary` so API errors do not reveal internal paths or system logics.
  - Ensure logout sweeps client-side cache & PII from localStorage (`civicpath_profile`).

---
*This file serves as the roadmap for the second phase of our 6-field improvement strategy focused on Security and Responsible Implementation.*
