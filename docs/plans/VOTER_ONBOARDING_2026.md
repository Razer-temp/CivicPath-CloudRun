# 2026 Global Voter Onboarding Schema & Best Practices

To build a robust, inclusive, and accurate voter onboarding flow for the 2026 global election cycles, we need to collect specific demographic and geographic information. Election laws are highly localized, so knowing the user's exact context is critical for providing accurate guidance on deadlines, ID requirements, and ballot information.

Below is the compilation of the **Latest 2026 Best Practices** for Voter Onboarding Data Collection, synthesized from global election standards.

## 1. Core Identity & Location (The "Where & Who")
To accurately route a user to their specific election rules, we must collect:
*   **Country of Citizenship:** Determines which national elections the user can vote in (e.g., USA, India, UK).
*   **Country of Residence:** Crucial for expats. If Residence != Citizenship, the user needs "Overseas/Absentee Voting" guides.
*   **Region / State / Province:** Election administration is usually handled at the state/provincial level (e.g., US States handle their own elections; Indian States have specific Chief Electoral Officers).
*   **Postal Code / ZIP Code:** Essential for finding local polling stations, exact ballot measures, and local representatives (e.g., US Congressional District, India Lok Sabha Constituency).

## 2. Voter Eligibility & Status (The "Can I Vote?")
*   **Date of Birth (or Age Range):** To verify voting age eligibility. globally, the voting age is usually 18, but some countries (like Austria, Brazil, and Scotland) allow voting at 16.
*   **First-Time Voter Status (Boolean):** 
    *   If `true`: The app should trigger fundamental explanations (How to use an EVM, what to bring to the polling booth, how to register).
    *   If `false`: The app can skip basics and focus on specific candidate research and countdowns.
*   **Current Registration Status:**
    *   *Not Registered / Unsure / Registered*
    *   Guides the immediate next call-to-action (e.g., "Step 1: Check Registration Status" vs "Step 1: Research your candidates").

## 3. Localization & Accessibility
*   **Primary Language Preference:** Crucial for regions like India (which has 22 official languages) or the US (Spanish/English). Translating legal election jargon into native languages increases participation.
*   **Accessibility Needs (Optional):** Some users may require mail-in ballots or accessible voting machines due to disabilities.

## 4. Proposed Database Schema (Firestore)
When we implement this in `AuthContext` and our UI, the `user` document should store:

```json
{
  "uid": "user_123",
  "email": "voter@example.com",
  "displayName": "Citizen Jane",
  "authProvider": "google | email",
  "onboardingComplete": true,
  "civicProfile": {
    "citizenshipCountry": "IND",
    "residenceCountry": "IND",
    "regionState": "MH",
    "postalCode": "400001",
    "isFirstTimeVoter": true,
    "registrationStatus": "unsure",
    "language": "hi",
    "userPersona": "student" 
  },
  "stamps": ["registered", "researched_candidates"],
  "createdAt": "2026-04-27T10:00:00Z"
}
```

## 5. UI/UX Strategy for the Form
Rather than overwhelming the user during the initial "Sign Up" page, the best practice is **Progressive Disclosure**:
1.  **Step 1:** Basic Auth (Email/Password or Google) -> *They are now securely logged in.*
2.  **Step 2:** The "Welcome Wizard" (Onboarding Flow) -> *Ask Country, State, and First-Time Voter status in a visually appealing, gamified 3-step wizard.*
3.  **Step 3:** Land on the `Profile` or `Guide` page customized completely to their wizard answers.
