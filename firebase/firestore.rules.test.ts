import { describe, it, beforeAll, afterAll } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

/**
 * Firestore Security Rules Test Suite
 * 
 * Tests the "Dirty Dozen" attack payloads against CivicPath's Firestore rules
 * to validate that the zero-trust security architecture holds.
 * 
 * Requires Firebase Local Emulator Suite to run:
 *   firebase emulators:start --only firestore
 */

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-civicpath-test',
    firestore: {
      rules: readFileSync('firebase/firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('CivicPath Firestore Security Rules', () => {
  const aliceId = 'alice123';
  const bobId = 'bob456';

  // --- User Document Security ---

  it('Payload 1: Reject ghost fields (The Shape Shifter)', async () => {
    const db = testEnv.authenticatedContext(aliceId).firestore();
    // Creating with unexpected ghost field should fail
    await assertFails(db.doc(`users/${aliceId}`).set({
      email: 'alice@example.com',
      name: 'Alice',
      uid: aliceId,
      hasCompletedOnboarding: false,
      profile: { country: 'in' },
      ghostField: true,
    }));
  });

  it('Payload 2: Reject massive strings (Size Exhaustion)', async () => {
    const db = testEnv.authenticatedContext(aliceId).firestore();
    const largeStr = 'a'.repeat(300);
    // Email with 300 chars exceeds the 200 char limit
    await assertFails(db.doc(`users/${aliceId}`).set({
      email: largeStr,
      name: 'Alice',
      uid: aliceId,
      hasCompletedOnboarding: false,
      profile: {},
    }));
  });

  it('Payload 3: Reject ID spoofing (cross-user write)', async () => {
    const db = testEnv.authenticatedContext(aliceId).firestore();
    // Alice trying to write to Bob's document
    await assertFails(db.doc(`users/${bobId}`).set({
      email: 'bob@example.com',
      name: 'Bob',
      uid: bobId,
      hasCompletedOnboarding: false,
      profile: {},
    }));
  });

  it('Payload 4: Reject Array Bomb (oversized stamps array)', async () => {
    const db = testEnv.authenticatedContext(aliceId).firestore();
    const largeArray = new Array(100).fill(1);
    // stamps array limit is 50
    await assertFails(db.doc(`users/${aliceId}`).set({
      email: 'alice@example.com',
      name: 'Alice',
      uid: aliceId,
      hasCompletedOnboarding: false,
      profile: {},
      stamps: largeArray,
    }));
  });

  it('Payload 6: Reject PII Blanket (cross-user read)', async () => {
    const db = testEnv.authenticatedContext(bobId).firestore();
    // Bob trying to read Alice's document
    await assertFails(db.doc(`users/${aliceId}`).get());
  });

  // --- Cache Collections Security ---

  it('Cache collections allow public reads for shared AI responses', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    // Unauthenticated read from ai_responses should succeed
    // (Depends on whether document exists, but the rule allows it)
    // This tests the rule itself
    await assertSucceeds(db.doc('ai_responses/test_cache_key').get());
  });

  it('Cache collections reject unauthenticated writes', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.doc('ai_responses/test_key').set({
      cache_key: 'test_key',
      content: 'malicious content',
      timestamp: new Date().toISOString(),
    }));
  });

  it('Cache collections reject list operations', async () => {
    const db = testEnv.authenticatedContext(aliceId).firestore();
    await assertFails(db.collection('ai_responses').get());
  });

  // --- Global Safety Net ---

  it('Global safety net blocks unknown collections', async () => {
    const db = testEnv.authenticatedContext(aliceId).firestore();
    await assertFails(db.doc('unknown_collection/doc').get());
    await assertFails(db.doc('unknown_collection/doc').set({ data: true }));
  });
});
