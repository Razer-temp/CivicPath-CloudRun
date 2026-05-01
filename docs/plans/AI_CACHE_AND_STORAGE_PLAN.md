# AI Architecture & Data Persistence Plan (2026 Edition)

## 1. The Core Challenge
The application needs to dynamically generate high-quality civic education content (timelines, quizzes, myths) using Gemini 2.5 Flash, while balancing three major priorities:
1. **Cost & Speed:** The AI should not regenerate the exact same content for multiple users. 
2. **User Data Separation:** Users should be able to explore "sandbox" journeys (e.g., exploring Canadian elections as a student) that sync across their devices, without polluting their main real-life identity (Citizen Profile).
3. **Graceful Degradation (Quotas):** Both Google Cloud/Firestore (50k free reads) and the Gemini API (15 RPM / 1500 RPD) have strict limits that will cause errors during a surge. 

## 2. Three-Tier Data Architecture

We will implement a state-of-the-art 3-Tier storage strategy to perfectly separate concerns:

### Tier 1: The Global Prompt Cache (Cost-Saver)
* **Location:** Firestore (`/ai_responses/{hash}`, `/quiz_content/{hash}`, `/myth_content/{hash}`)
* **Purpose:** If User A asks for "Indian Election Timeline for Students", and User B asks the exact same thing, User B gets it instantly from Tier 1.
* **Separation:** This data contains NO user-specific information. It is purely hashed prompt parameters paired with AI output.

### Tier 2: The User Sandbox (Personalized State)
* **Location:** Firestore Subcollection (`/users/{userId}/journeys/{journeyId}`)
* **Purpose:** Right now, the "Journey Setup" only saves to local storage (`localStorage.getItem("civicpath_journey")`). This means if a user switches from mobile to laptop, they lose their active learning session.
* **Implementation:** When a user starts a Journey, we create a record in their `journeys` subcollection. Their quiz scores, current step, and selected country/persona for *that specific journey* live here.

### Tier 3: The Citizen Vault (Permanent Identify)
* **Location:** Firestore Document (`/users/{userId}`)
* **Purpose:** Real-life demographics, actual registration status, and global "stamps" earned across all journeys.

## 3. Limit & Quota Handling Engineering

In 2026, raw error messages are unacceptable UI. We will build a robust interception system.

### A. Gemini Rate Limits (HTTP 429)
When Gemini hits the 15 RPM limit, the API throws `[429 Too Many Requests]`.
* **The Fix:** Implement an exponential backoff in `geminiService.ts`. If it fails persistently, fail over to a pre-defined hardcoded fallback (e.g., standard generic civics text) so the UI never breaks. Show a subtle toast: *"CivicBot is taking a breather due to high demand. Showing generalized data."*

### B. Firestore Quota Limits (FirebaseError: Quota Exceeded)
If the app goes viral, the 50k read quota might hit.
* **The Fix:** Wrap all `crowdCache` get/set operations in strict try-catch blocks. If Firestore is unreachable or out of quota, we seamlessly short-circuit strictly to **Local API Execution** (generating directly via Gemini, bypassing the global cache lookup). If both are exhausted, present the `RateLimitFallbackComponent`.

## 4. Immediate Implementation Steps

**Step 1: Upgrade the Database Schema**
* Update `firebase-blueprint.json` and `firestore.rules` to define and secure the `/users/{userId}/journeys/{journeyId}` collection.

**Step 2: Journey Syncing**
* Modify `JourneySetup.tsx` and `Guide.tsx` so that instead of writing to `localStorage`, it creates/reads a Journey record in Firebase, guaranteeing cross-device sync.

**Step 3: Build the `QuotaErrorBoundary`**
* Create a dedicated UI component to vividly but gently explain when limits are hit.
* Add rate-limit parsing to `geminiService.ts` to seamlessly swap out the data provider.

**Step 4: Content Bookmarking**
* Allow users to "save" specific AI-generated responses (like a myth or quiz) to a `/users/{userId}/saved_content/` subcollection so it's permanently theirs, independent of the global cache.
