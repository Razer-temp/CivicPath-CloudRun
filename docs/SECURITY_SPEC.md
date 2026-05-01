# Security Specification (CivicPath)

## 1. Data Invariants
- A User document can only be accessed or modified by the user who owns it (UID match).
- The User document must conform exactly to the valid profile blueprint (no ghost fields).
- Any attempt to update the User document must not alter read-only fields if they existed, and all updates must strictly specify the affected keys using `hasOnly`.
- Only strings, maps, and specific lists are allowed. Arrays must have length limits. Strings must have size limits.

## 2. The "Dirty Dozen" Payloads
1. **The Shape Shifter**: Updating with a `ghostField: true`. (Integrity)
2. **The Size Exhaustion**: Updating email with a 1MB string. (Integrity)
3. **The ID Spoof**: Creating a document for `user/Bob` while authenticated as `Alice`. (Identity)
4. **The Array Bomb**: Appending 100,000 stamps to the stamps array. (Integrity)
5. **The Role Escalation**: Attempting to add an `isAdmin: true` field. (State)
6. **The Unverified Email Spoof**: Setting email to someone else's email while unverified. (Identity)
7. **The Type Mismatch**: Setting `stamps` to a string instead of a list. (Type constraint)
8. **The PII Blanket**: Trying to `list` or `get` another user's document. (Identity)
9. **The Null Poisoning**: Passing null to required nested objects. (State)
10. **The Map Size Explosion**: Putting 10,000 keys inside the `profile` map. (Integrity)
11. **The Object Swap**: Replacing `profile` map with a string. (Type constraint)
12. **The Ghost Authentication**: Accessing documents without auth. (Identity)

## 3. The Test Runner
See `firestore.rules.test.ts`.
