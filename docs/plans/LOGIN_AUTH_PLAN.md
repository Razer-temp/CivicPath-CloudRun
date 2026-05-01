# Mandatory Authentication & Data Persistence (2026 Blueprint)

## Core Objective
Transition CivicPath from a local-only prototype to a fully authenticated, state-persistent web application. Every user must log in to access the personalized guides, and all their progress (quiz scores, completed steps, chosen country) must be saved securely in the cloud.

## 2026 Strategy & Zero-Cost Constraints
To maintain the "Zero Credit Card" requirement outlined in `AGENTS.md`, we will strictly utilize the Google/Firebase ecosystem's free tiers:

1. **Authentication:** Firebase Auth (Google Sign-In). 
   - *Why?* Frictionless "one-tap" onboarding. No password management. Highly secure and absolutely free for standard active user bases.
2. **Database (State Sync):** Firestore (NoSQL).
   - *Why?* Generous free tier (50k reads/20k writes per day). We will use a "Debounced Sync" pattern to only write to the database periodically, keeping us well within free limits even with high traffic.
3. **Route Protection (Gatekeeper):** 
   - Unauthenticated users attempting to visit `/guide` or `/onboard` will be intercepted and redirected to `/login`.

## UI/UX Design for `/login`
We need a world-class, high-conversion login page that matches the tone of CivicPath:
- **Visuals:** Split-screen or centered floating glassmorphism card. We'll use a dynamic background (perhaps the globe or an abstract democratic motif) using Tailwind CSS and Framer Motion.
- **Micro-interactions:** A satisfying hover state on the "Continue with Google" button, accompanied by a secure loading state.
- **Copywriting:** "Your voice matters. Sign in to start your democratic journey."

## Architectural Implementation Steps

### 1. Firebase Configuration (`src/services/firebase.ts`)
- Ensure Firebase app is initialized securely using Vite environment variables.
- Export `auth`, `googleProvider`, and `db` (Firestore).

### 2. State Management Upgrade
- Modify the global state (currently in LocalStorage/Zustand or Context) to bind with Firestore.
- **Structure:** `users/{uid}`
  - `email`: string
  - `displayName`: string
  - `onboardingCompleted`: boolean
  - `selectedCountry`: string
  - `completedModules`: string[]
  - `quizScores`: Record<string, number>

### 3. Dedicated Login Page (`src/pages/LoginPage.tsx`)
- Build the UI.
- Implement `signInWithPopup(auth, googleProvider)`.
- Handle errors cleanly (e.g., popup closed by user).

### 4. Auth Gatekeeper (`src/components/auth/ProtectedRoute.tsx`)
- A wrapper component for React Router.
- Checks if `auth.currentUser` is present.
- Shows a fullscreen minimal spinner while the auth state is resolving.

### 5. Navbar Integration
- Replace the static "Google Sign-In" placeholder button in the Navbar with an actual authenticated user avatar and a "Sign Out" dropdown or button.

## Execution Requirements
Before executing this plan, the environment must have a valid `.env` with Firebase configuration. 
If it doesn't currently exist, we will mock the Firebase initialization logic safely so the app doesn't crash, but prepare it to instantly work once the user provides their `VITE_FIREBASE_*` keys.
