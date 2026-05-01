# Agent Instructions for CivicPath

This file provides the core directives and architectural constraints for building the **CivicPath** application. The AI Studio agent must strictly adhere to these rules throughout the development lifecycle.

## 📌 Project Overview
**App Name:** CivicPath
**Description:** A PWA (Progressive Web App) guiding first-time voters through the election process with deep localization, gamified learning, and AI assistance. Designed for the Virtual Prompt Wars Hackathon (Challenge 2).
**Primary Reference File:** `/PROJECT_GUIDE.md` (Always read this file if you need exact details about pages, features, or integrations).

## ⚠️ Core Directives
1. **Zero Credit Card Rule:** Every single integration, API, and service used in this project MUST be accessible without a credit card. Rely on free tiers, free APIs, and mock implementations if a paid API is the only alternative.
2. **Tech Stack Constraints:**
   - **Frontend:** React, Vite, Tailwind CSS. Avoid heavy UI component libraries unless absolutely necessary; use Tailwind directly for standard layouts.
   - **AI:** Gemini 2.5 Flash via `@google/genai` (use `process.env.GEMINI_API_KEY`).
   - **Backend/DB:** Firebase (Auth, Firestore, Hosting) and Google Sheets API (via a proxy/Apps Script or standard API fetch).
3. **PWA First:** All UI components should be mobile-first and responsive, keeping in mind the app is intended to be a PWA.

## 🗺 Implementation Strategy
When responding to user prompts to build features:
- Only execute what the user explicitly asks for.
- Do not build parallel features unprompted.
- If a user asks to "build page X", refer to `/PROJECT_GUIDE.md` to see the exact specifications for Page X, and implement only those.
- For APIs that require complex setup (like Bhashini, Google Docs/Drive/Calendar API, Google Civic Info), stub them out with functional mock data FIRST, and implement the real network calls progressively when the user confirms.

## 🎨 Design Language
- **Vibe:** Clear, accessible, non-partisan, educational, modern.
- **Typography:** Legible on all devices. Standardize margins and paddings for a clean "wizard" feel.
- **Colors:** Use trusted, accessible colors (e.g., deep blues, clean whites). Avoid overwhelming primary colors that might signal specific political parties.
- **Micro-interactions:** Since this is an educational tool, use transitions (Framer Motion / Tailwind transitions) to make step-by-step learning feel fluid and less like a static document.

## 🤝 Pre-execution Checklist
Before modifying files related to a major feature from the guide:
1. Read `/PROJECT_GUIDE.md` for context.
2. Ensure Firebase initialization is correctly structured if the feature requires DB/Auth.
3. Check `.env.example` to ensure new API keys (if needed) are documented.
