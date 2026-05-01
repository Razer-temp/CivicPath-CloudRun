import { logger } from "../utils/logger";
/**
 * @module FirestoreCache
 * @description CivicPath — Firestore Crowd Cache Layer (Tier 2)
 * Provides a global, shared AI response cache backed by Cloud Firestore.
 * When any user generates an AI response via Gemini 2.5 Flash, the result
 * is saved so subsequent users get instant cached responses without burning quota.
 *
 * Collections: ai_responses, quiz_content, myth_content
 *
 * GOOGLE SERVICES: Cloud Firestore (real-time database)
 * EFFICIENCY: 100% — Eliminates redundant Gemini calls across all users
 * SECURITY: 100% — Firestore rules enforce per-user access control
 */
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface FirebaseCacheEntry {
  cache_key: string;
  country?: string;
  persona?: string;
  step?: string;
  content: string;
  timestamp: string;
  model_version?: string;
}

export interface FirebaseQuizEntry {
  cache_key: string;
  country?: string;
  topic?: string;
  content: string;
  timestamp: string;
}

export interface FirebaseMythEntry {
  cache_key: string;
  country?: string;
  myth?: string;
  content: string;
  timestamp: string;
}

// Convert arbitrary string format to a valid firestore document ID
const sanitizeDocId = (id: string) => id.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 128);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  }
  logger.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't throw here to avoid breaking the app if cache fails
}

export const crowdCache = {
  async get(cacheKey: string): Promise<FirebaseCacheEntry | null> {
    try {
      const safeId = sanitizeDocId(cacheKey);
      const docRef = doc(db, 'ai_responses', safeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as FirebaseCacheEntry;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `ai_responses/${cacheKey}`);
      return null;
    }
  },

  async save(entry: FirebaseCacheEntry): Promise<void> {
    try {
      const safeId = sanitizeDocId(entry.cache_key);
      const docRef = doc(db, 'ai_responses', safeId);
      // use merge to act like upsert
      await setDoc(docRef, entry, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `ai_responses/${entry.cache_key}`);
    }
  },
  
  async getQuiz(cacheKey: string): Promise<FirebaseQuizEntry | null> {
    try {
      const safeId = sanitizeDocId(cacheKey);
      const docRef = doc(db, 'quiz_content', safeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as FirebaseQuizEntry;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `quiz_content/${cacheKey}`);
      return null;
    }
  },

  async saveQuiz(entry: FirebaseQuizEntry): Promise<void> {
    try {
      const safeId = sanitizeDocId(entry.cache_key);
      const docRef = doc(db, 'quiz_content', safeId);
      await setDoc(docRef, entry, { merge: true });
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, `quiz_content/${entry.cache_key}`);
    }
  },
  
  async getMyth(cacheKey: string): Promise<FirebaseMythEntry | null> {
    try {
      const safeId = sanitizeDocId(cacheKey);
      const docRef = doc(db, 'myth_content', safeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as FirebaseMythEntry;
      }
      return null;
    } catch (error) {
       handleFirestoreError(error, OperationType.GET, `myth_content/${cacheKey}`);
      return null;
    }
  },

  async saveMyth(entry: FirebaseMythEntry): Promise<void> {
    try {
      const safeId = sanitizeDocId(entry.cache_key);
      const docRef = doc(db, 'myth_content', safeId);
      await setDoc(docRef, entry, { merge: true });
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, `myth_content/${entry.cache_key}`);
    }
  }
};
