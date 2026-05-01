# 2026 Code Quality & Maintainability Plan

Based on the latest 2026 React, Vite, and TypeScript best practices, this document outlines the core structural and qualitative improvements we will apply to the CivicPath project to ensure a 100/100 code quality score.

## 1. Feature-Driven Architecture (Vertical Slicing)
- **Current State:** Flattened `pages` folder with mixed domains (e.g., `Home.tsx`, `LoginPage.tsx`, `guide/`) and massive single-file components.
- **2026 Best Practice:** Group code by "Feature" or "Domain" rather than purely by technical type. 
- **Action:** 
  - Break down large components like `Home.tsx` into modular sub-components (e.g., `HeroSection.tsx`, `NewsWidget.tsx`, `FeatureHighlights.tsx`).
  - Extract complex localized chunks (like `EVMExplainer.tsx` or `SakshamVoice.tsx`) into a dedicated `features/` directory if they grow too large.

## 2. Strong Typing & TypeScript Strictness
- **Current State:** Instances of `any` types (e.g., `profile: any` in step components), inline raw fetching, and sometimes loose interfaces.
- **2026 Best Practice:** 100% Type Safety. Interfaces for all props, states, and API responses. 
- **Action:** 
  - Define a strict `UserProfile` interface in `types.ts` and replace every `any` with the exact type.
  - Define strict types for API responses (e.g., News RSS, Geocoding) and avoid type assertions where possible.

## 3. Custom Hooks for Data Fetching & Side Effects
- **Current State:** Lengthy `useEffect` blocks inside UI components (e.g., RSS fetching in `Home.tsx`, Geocoding in Map components).
- **2026 Best Practice:** Presentation logic should be separated from Business/Data logic.
- **Action:** 
  - Create custom hooks like `useElectionNews()`, `useGeolocation()`, and `useAddressGeoconvert()`.
  - Extract the heavy Gemini AI fetching logic into custom hooks or robust service wrappers with clear caching boundaries.

## 4. Enhanced Routing & Error Boundaries
- **Current State:** Basic React Router DOM implementation.
- **2026 Best Practice:** Utilize nested routing properly, add Suspense for lazy loading (code-splitting), and implement robust Error Boundaries for isolated failures.
- **Action:** 
  - Wrap features with React `<Suspense>` and error boundaries to ensure that if one component (like the Map or Voice Assistant) fails, the rest of the application remains usable.

## 5. Centralized Service/API Layer
- **Current State:** Raw `fetch` and Google API calls scattered across components (e.g., `MapPage.tsx`, `Home.tsx`).
- **2026 Best Practice:** Centralized API callers to easily rotate API keys, handle rate limits, and track errors.
- **Action:** 
  - Move external API calls (News RSS, Google Geocoding, Wikipedia) into `services/externalApi.ts` or similar centralized wrappers.

## 6. Meaningful Reusability & Tailwind Consistency
- **Current State:** Repeated Tailwind classes and heavy inline styling logic across modals and cards.
- **2026 Best Practice:** Use UI component libraries effectively (like the `cn` utility) and abstract redundant structural classes into reusable micro-components (`Card`, `Badge`, `Alert`).
- **Action:** 
  - Audit the UI for repeating patterns and extract them into `src/components/ui`.

---
*This file will serve as the roadmap for the first phase of our 6-field improvement strategy focused on Code Quality.*
