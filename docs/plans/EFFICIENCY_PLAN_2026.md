# 2026 Efficiency & Resource Optimization Plan

Based on the latest 2026 performance paradigms for React, Vite, Firebase, and GenAI, this document outlines the core structural and qualitative efficiency improvements we will apply to the CivicPath project to ensure a 100/100 performance and efficiency score.

## 1. Aggressive Code Splitting & Lazy Loading
- **Current State:** The app uses basic `lazy()` but might still lump too much dependency weight in the main chunk.
- **2026 Best Practices:** Route-based and Component-based suspense boundaries. 
- **Action:** 
  - Ensure all heavy routes (`Guide.tsx`, `AssistantPage.tsx`, `LearnPage.tsx`) and heavy components (like 3D Canvas or complex Interactive elements) are dynamically imported.
  - Optimize Vite's rollup options to split vendor chunks (e.g., separating `firebase`, `framer-motion`, and `react` into distinct cached chunks).

## 2. React State & Re-render Minimization
- **Current State:** Providers (`AuthContext`, `LanguageContext`) or heavy parent components might trigger cascading re-renders.
- **2026 Best Practices:** State collocation and strict memoization.
- **Action:** 
  - Ensure `useMemo` and `useCallback` are used effectively for heavy computations or object references passed down as props.
  - Avoid object/array literals inside `useEffect` dependency arrays to prevent infinite loops.
  - Use atomic state patterns where applicable, or split Contexts if one changes frequently (e.g., splitting static Language info from dynamic UI state).

## 3. Firebase Resource & Cost Optimization
- **Current State:** Firestore snapshot listeners (`onSnapshot`) might over-fetch or stay open unnecessarily.
- **2026 Best Practices:** Minimize active listeners, leverage local caching, and avoid N+1 query problems.
- **Action:**
  - Utilize offline persistence (if applicable) or cache-first fetch policies (`{ source: 'cache' }`) to save read costs.
  - Ensure all `onSnapshot` listeners are properly unsubscribed when components unmount.
  - Restrict list queries using limits (`limit(10)`) and pagination to prevent over-fetching.

## 4. API Caching & Edge Optimization
- **Current State:** `cacheService.ts` exists but could be optimized to reduce redundant Gemini and Wikidata calls.
- **2026 Best Practices:** Multi-layered caching (Memory -> LocalStorage/IndexedDB -> API).
- **Action:**
  - Standardize `cacheService` to provide TTL (Time-to-Live) for responses so that static WikiData/Gemini completions don't spam the network across sessions.
  - Batch Knowledge Graph requests where possible.

## 5. Asset & Animation Efficiency
- **Current State:** Framer Motion (`motion/react`) animations are used, which can be heavy if not hardware-accelerated.
- **2026 Best Practices:** Use `will-change` properties implicitly via framer-motion, and reduce thread-blocking JavaScript.
- **Action:**
  - Prefer CSS transitions or Tailwind's natively accelerated classes (`transition-all duration-300 ease-out`) for simple hover states to save JS execution time.
  - Use `layout` animations sparingly and ensure images have explicit `width` and `height` to prevent Cumulative Layout Shift (CLS).

---
*This file serves as the roadmap for the third phase of our 6-field improvement strategy focused on Efficiency and Optimal Use of Resources.*
