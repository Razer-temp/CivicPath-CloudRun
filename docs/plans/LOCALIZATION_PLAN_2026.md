# CivicPath Localization & Internationalization (i18n) Plan - 2026

## 📌 Objective
To implement a robust, app-wide global language switching mechanism scaling across all components in CivicPath, ensuring localized education for first-time voters.

## ⚠️ Core Directive Check
In adherence to the **Zero Credit Card Rule** (no paid Google Cloud Translation API subscriptions), this plan utilizes *local static catalogs* for UI elements and leverages our *existing free-tier Gemini 2.5 Flash API* for on-the-fly dynamic content translation.

## 🗺️ Architecture & Best Practices (2026 Standards)

### 1. Static UI Localization (i18next)
We will use the industry-standard `i18next` and `react-i18next` packages for zero-latency UI translations.
- **Implementation**: 
  - Install `i18next` and `react-i18next`.
  - Create a `src/i18n/` directory containing JSON catalogs (e.g., `en.json`, `hi.json`, `es.json`, `ta.json`).
  - Wrap the Vue/React tree in an `I18nextProvider` (or configure globally via init).
- **Why?** It's the most performant way to switch static text (buttons, labels, nav links) without network overhead.

### 2. Global State Management (`LanguageContext`)
- Create a `LanguageContext` (or integrate into a unified `AppContext`) that exposes:
  - `currentLanguage` (e.g., 'en', 'hi', 'ta')
  - `setLanguage(lang)` function.
- **Persistence**: Store the selected language in `localStorage` (`civicpath_lang`) and sync it to Firebase Firestore (`users/{userId}/preferences`) so the user's choice persists across devices.

### 3. Dynamic Content Translation (Gemini 2.5 Flash + Cache)
Our learning modules, myths, and quizzes are dynamically generated. We cannot store infinite JSON files for generative content.
- **The Engine**: When the user requests dynamic content (e.g., "Tell me about voting in India") in a non-English language, we will inject the target language into the `geminiService.ts` system prompt.
- **The Cache**: 
  - To prevent rate limits (HTTP 429), we will extend our `crowdCache` / Firestore integration. 
  - Cache Key Strategy: `${topic}_${country}_${language}`.
  - If a user requests a Tamil guide to voting, we check the DB first. If it misses, Gemini translates/generates it, and we cache it globally for all future Tamil users.

### 4. Language Switcher UI
- A persistent, accessible dropdown in the main `Navbar.tsx` (top right).
- Uses native language names (e.g., "English", "हिंदी (Hindi)", "தமிழ் (Tamil)").
- Auto-detects browser locale (using `navigator.language`) on first visit, but allows manual override.

## 🚀 Execution Phases

### Phase 1: Core Setup
1. `npm install i18next react-i18next i18next-browser-languagedetector`
2. Create `src/i18n/config.ts` and initialize static language bundles.
3. Wrap `App.tsx` with the translation provider.

### Phase 2: UI Switcher
1. Build `<LanguageSwitcher />` component.
2. Integrate into the top navigation.
3. Convert core hardcoded strings in `Home.tsx` and `Navbar.tsx` to `useTranslation()` hooks hooks.

### Phase 3: Adapting AI Services
1. Pass the globally selected language from Context to `geminiService.ts`.
2. Update prompts: `"Generate a response in ${userLanguage}..."`
3. Ensure the `ErrorBoundary` handles quota limits gracefully if translation requests spike.

### Phase 4: Full App Conversion
1. Systematically replace text in `JourneySetup`, `MapPage`, and `Guide` with `t('keys')`.
2. Ensure Right-to-Left (RTL) support (like Arabic/Urdu) is cleanly supported by toggling `dir="rtl"` on the `<html>` root if needed.
