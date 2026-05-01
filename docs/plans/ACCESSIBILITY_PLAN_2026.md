# 2026 Accessibility (a11y) & Inclusive Design Plan

Based on the latest WCAG 2.2 standards and 2026 inclusive design paradigms for React and Tailwind CSS, this document outlines the core structural accessibility improvements to apply to the CivicPath project to ensure a 100/100 accessibility score.

## 1. Compliance with WCAG 2.2 Core Standards
- **Focus Not Obscured:** Ensure floating elements (like sticky headers or bot popups) never obscure the focused element.
- **Minimum Target Size:** All touch targets must be at least `44x44px` on mobile, aligning with both WCAG 2.2 AA (which requires 24x24 minimum) and strict mobile conventions.
- **Dragging Movements:** For gamified or interactive elements, ensure alternative (click-based) methods exist (e.g., clicking to select rather than requiring drag-and-drop).

## 2. React Focus & Route Management
- **Current State:** Single Page Applications (SPAs) often fail to shift focus when changing routes, confusing screen reader users.
- **2026 Best Practices:** Route transition focus management.
- **Action:**
  - Implement an invisible `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>` at the top of the app tree.
  - Automatically reset focus to the newly mounted page's `<h1>` (using `tabIndex={-1}`) upon route change.
  - Trap focus inside Modals and Dialogs (using standard libraries or strict `aria-modal="true"` combined with focus-trapping routines).

## 3. Tailwind CSS & Visual Accessibility
- **Current State:** Hover states are present but `focus-visible` might be underutilized.
- **2026 Best Practices:** Distinct, high-contrast focus rings that differentiate mouse clicks from keyboard navigation.
- **Action:**
  - Standardize focus rings globally using Tailwind: `focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2`.
  - Use `motion-reduce:` modifiers on all Framer Motion and standard CSS animations to respect user OS preferences for reduced motion.
  - Ensure contrast ratios meet WCAG 2.1 AA (4.5:1 for standard text) across light/dark backgrounds (e.g., avoiding low-contrast grays on white).

## 4. Semantic HTML & ARIA for Dynamic Content (Gemini Assistant)
- **Current State:** AI responses load dynamically, which screen readers might not announce.
- **2026 Best Practices:** Live regions and strict semantic HTML.
- **Action:**
  - Use `aria-live="polite"` or `aria-atomic="true"` on the AI chat container so screen readers announce when the chatbot responds.
  - Replace non-interactive `div` elements that act as buttons with semantic `<button type="button">` to gain native keyboard support (Space / Enter key activation).
  - Use `<fieldset>` and `<legend>` for grouped form elements like election choices.

## 5. Screen Reader Enhancements (sr-only)
- **Action:**
  - Ensure every Icon-only button (e.g., Language Switcher globe, user profile icon) contains a `<span className="sr-only">Descriptive Text</span>`.
  - Add descriptive standard text to visual gamification (e.g., "Step 2 completed, stamp earned" hidden from visual users but available to screen readers).

---
*This file serves as the roadmap for the fifth phase of our 6-field improvement strategy focused on Accessibility, Inclusive Design, and WCAG compliance.*
