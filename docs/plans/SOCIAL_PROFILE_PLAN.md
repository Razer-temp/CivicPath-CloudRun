# 2026 Social Profile UX Implementation Plan (CivicPath)

## Core Philosophy (2026 Trends)
In 2026, social profiles have evolved away from static lists into **dynamic, gamified telemetry dashboards** (often called "Bento Box" layouts). Identity is defined by verifiable action rather than text bios.

For CivicPath, the user's profile should feel like a proud, shareable "Civic Passport."

## Key UX Features to Implement
1. **The Bento Grid Layout:** Instead of a single vertical column, the profile will use a responsive CSS Grid with different sized cards highlighting specific metrics.
2. **Avatar & Verified Status:** Using the user's Google Photo, wrapped in a glowing "Verified Voter" ring if they complete onboarding.
3. **The "Trophy Case" (Badges & Stamps):** Progress isn't just a number; it's a collection. The "stamps" array in Firestore will generate visual badges.
4. **Political Compass / Persona Indicator:** Highlighting the user's chosen persona (e.g., "The Change Maker") with a specific color theme or icon.
5. **Shareability:** A "Share Passport" button mimicking modern Spotify Wrapped or Twitter wrapped components.

## Implementation Steps

### 1. Create `/src/pages/ProfilePage.tsx`
This will be the central hub for the user profile.
- Fetch `user` and `profile` from our existing `useAuth` hook.
- Implement a Bento Box UI using Tailwind grid (`grid-cols-1 md:grid-cols-3`).
- Cards to include:
  - **Hero Card:** Avatar, Name, Email, "Joined 2026".
  - **Persona Card:** Displays their Onboarded Persona + Goal.
  - **Stamps Collection:** A visual grid of the steps they have completed.
  - **Civic Graph (Simulated):** A small chart or progress bar showing completion %.

### 2. Update `App.tsx` and Navigation
- Add `<Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />` to `App.tsx`.
- Update the `Navbar.tsx` so clicking on the User Avatar or adding a "Profile" button routes the user to `/profile`.

### 3. Polish & Animations
- Use Framer Motion for card entrance animations.
- Implement hover states that slightly lift the bento box tiles.
