# CivicPath - Project Guide

**Tagline:** Your guided journey to understanding democracy.
**Type:** Progressive Web App (PWA) - installable, offline-capable
**Target Users:** First-time voters, students, researchers, educators — globally, with deep India support
**Built For:** Virtual Prompt Wars Hackathon — Challenge 2: Election Process Education

## 🚨 The Problem It Solves
Election information is fragmented across dozens of government websites, locked in complex language, inaccessible to people who don't speak English, and completely overwhelming for first-time voters — especially in a country like India with 968 million registered voters across 22 languages. CivicPath fixes this by being the single guided companion that walks any person through their country's election process, step by step.

## 🛠 Tech Foundation
*   **Frontend:** React + Tailwind CSS
*   **App Type:** PWA (installable, offline via service worker)
*   **Hosting:** Firebase Hosting (free)
*   **Auth:** Firebase Auth — Google Sign-in (free)
*   **Database:** Firebase Firestore (free Spark plan)
*   **CMS:** Google Sheets + Apps Script (free)
*   **AI Brain:** Gemini 2.5 Flash via Google AI Studio (free)

## 📄 Total: 13 Pages

### Page 1 — `/` — Home
*   **Purpose:** First impression landing page.
*   **What's on it:** Hero section, 3 feature highlights, "How it works" (3 steps), Country preview strip, Navbar, Footer.
*   **Integrations:** REST Countries API, Firebase Auth, PWA install prompt.

### Page 2 — `/onboard` — Onboarding Wizard
*   **Purpose:** Personalizes the experience before the journey begins.
*   **4 Steps:**
    1.  Select country
    2.  Who are you? (First-time voter / Student / Researcher / Educator)
    3.  Language (auto-detected, overrideable, e.g., Hindi, Tamil, English)
    4.  What to learn (Full journey / Registration only / Voting day only / How results work)
*   **Integrations:** Google Cloud Translate API, Firebase Auth, Firebase Firestore, REST Countries API.

### Page 3 — `/guide` — The Guided Journey 🌟 (Core Page)
*   **Purpose:** The heart of CivicPath. A 5-step guided learning journey localized to the user.
*   **5 Steps:**
    1.  What is an election? (Plain language explanations, REST API summaries)
    2.  Voter Registration (Deadlines, eligibility, how-to. India: form 6 info. US: Google Civic API)
    3.  Candidates & Parties (Researching candidates. India: data.gov.in API. US: Wikipedia REST API)
    4.  Voting Day (What to bring, process. Polling maps via Google Maps Demo. EVM+VVPAT interactive explainer)
    5.  Results & After (How votes are counted, formation of government)
*   **Features:** 3-question mini-quiz per step, TTS listen button, AI myth buster.
*   **Integrations:** Gemini 2.5 Flash, Google Sheets API, Google Civic Info API, data.gov.in API, Google Maps Demo Key, Google Cloud Translate API, Google Cloud TTS API, Bhashini API, Wikipedia REST API, Firebase Firestore.

### Page 4 — `/india` — India Deep Module 🇮🇳
*   **Purpose:** Dedicated India-only experience.
*   **Sections:** Saksham Voice Mode (Bhashini ASR->Gemini->Bhashini TTS), 3-Tier System Explainer (Lok Sabha, Rajya Sabha, Vidhan Sabha), EVM + VVPAT Explainer, Election Day Countdown, Candidate Lookup, "Am I Registered?" checker (links to ECI).
*   **Integrations:** Bhashini API, Gemini 2.5 Flash, data.gov.in API, ECI electoralsearch.eci.gov.in (deep links), Google Maps Demo Key, Firebase Firestore, Google Sheets API, Google Cloud Translate API.

### Page 5 — `/countries` — Country Explorer
*   **Purpose:** Browse 15+ supported countries. Select to start guided journey.
*   **Content:** Flag, name, population, election system type, next election date, current head of gov, registered voters.
*   **Integrations:** REST Countries API, Wikidata SPARQL API, civicAPI.org, Google Sheets API.

### Page 6 — `/quiz` — Civic Quiz Arena
*   **Purpose:** Standalone gamified quiz mode.
*   **3 Modes:** Country Quiz, Global Quiz, Speed Round (60 secs).
*   **Features:** Dynamic questions, daily streaks, badges, leaderboards, shareable score card via HTML Canvas.
*   **Integrations:** Gemini 2.5 Flash, Firebase Firestore, HTML Canvas API.

### Page 7 — `/map` — Polling Station Finder
*   **Purpose:** Find your nearest polling station with directions.
*   **Modes:** India Mode (ECI data -> map) / Global Mode (Google Civic Info / civicAPI.org -> map).
*   **Feature:** Open-Meteo Weather card for expected weather on voting day.
*   **Integrations:** Google Maps Demo Key, Google Civic Information API, ECI electoralsearch.eci.gov.in, civicAPI.org, Open-Meteo API.

### Page 8 — `/timeline` — Election Timeline
*   **Purpose:** Visual interactive timeline of the complete election calendar.
*   **Features:** Notification/Campaign/Voting/Counting periods. "Add to Google Calendar" button, Embedded Looker Studio charts showing historical voter turnout.
*   **Integrations:** Google Calendar API, Google Sheets API, Google Looker Studio, civicAPI.org.

### Page 9 — `/report` — My Voter Report
*   **Purpose:** Personalized civic readiness report after completing the guide.
*   **Content:** Steps completed, Quiz scores, Knowledge score out of 100, Key dates, nearest station, summary.
*   **Export:** Save to Google Drive (generates Docs document), Add all dates to Google Calendar.
*   **Integrations:** Google Drive API, Google Docs API, Google Calendar API, Firebase Firestore.

### Page 10 — `/learn` — Learning Library
*   **Purpose:** Reference library for any topic (e.g., "What is gerrymandering?", "What is NOTA?").
*   **Features:** Card with full explanation, Wikipedia summary/image, Listen button, Translate button, Ask AI button.
*   **Integrations:** Wikipedia REST API, Google Cloud TTS API, Google Cloud Translate API, Gemini 2.5 Flash, Google Sheets API.

### Page 11 — `/assistant` — CivicBot AI Assistant
*   **Purpose:** Full-page dedicated civic AI chat. Context-aware based on user's country/language.
*   **Features:** Persistent history, suggested questions, voice mode (mic -> Bhashini/STT -> Gemini -> TTS), Fact-check badge.
*   **Integrations:** Gemini 2.5 Flash, Bhashini API, Google Cloud STT/TTS, Google Cloud Translate API, Firebase Firestore.

### Page 12 — `/compare` — Election System Comparator
*   **Purpose:** Side-by-side comparison of any two countries' election systems.
*   **How it works:** Dropdowns to pick countries. Compares system type, voting method, voting age, mandatory voting, frequency, turnout, registered voters. Gemini generates a 3-sentence "Key Difference Summary".
*   **Integrations:** Wikidata SPARQL API, REST Countries API, Google Sheets API, Gemini 2.5 Flash, civicAPI.org.

### Page 13 — `/about` — About CivicPath
*   **Purpose:** Project context for judges and users.
*   **Contents:** The problem, architecture, integration list, team, source code, feedback form.
*   **Integrations:** Firebase Hosting, Google Forms.

## 🗄 Backend — Google Sheets CMS
Master Google Spreadsheet (read via Apps Script/API) containing:
1.  `countries`: Name, flag, system type, dates, etc.
2.  `india_states`: 28 states + 8 UTs info
3.  `timelines`: Per-country timeline events
4.  `library_cards`: Learning library topics
5.  `quiz_fallback`: Static questions in case Gemini rate-limits
6.  `voter_turnout`: Historical data for Looker Studio embeds

## 🔌 21 Integrations (Strictly FREE / Zero Credit Card)
1. Gemini 2.5 Flash
2. Firebase Hosting
3. Firebase Auth
4. Firebase Firestore
5. Google Sheets + Apps Script
6. Google Calendar API
7. Google Drive API
8. Google Docs API
9. Google Cloud Translate API
10. Google Cloud TTS API
11. Google Cloud STT API
12. Google Civic Information API
13. Google Maps Demo Key
14. Google Looker Studio
15. Bhashini API (PoC)
16. data.gov.in API
17. ECI electoral search
18. Wikidata SPARQL API
19. Wikipedia REST API
20. REST Countries API
21. civicAPI.org
22. Open-Meteo API
23. PWA Service Worker (built-in)
24. HTML Canvas API (built-in)
