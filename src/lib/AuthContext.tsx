import { logger } from "../utils/logger";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';
import { UserProfile, JourneyProfile } from '../types';

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
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  logger.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  saveProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create profile
        const userRef = doc(db, 'users', currentUser.uid);
        
        let userDoc;
        try {
          userDoc = await getDoc(userRef);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          return; // Stop execution on error
        }
        
        let currentProfileData = null;

        if (userDoc?.exists()) {
          currentProfileData = userDoc.data() as UserProfile;
          setProfile(currentProfileData);
          if (currentProfileData.profile) {
            localStorage.setItem("civicpath_profile", JSON.stringify(currentProfileData.profile));
          }
          if (currentProfileData.stamps) {
             localStorage.setItem("civicpath_stamps", JSON.stringify(currentProfileData.stamps));
          }
        } else {
          // Initialize empty defaults or sync from localStorage if present?
          const localProfile = localStorage.getItem("civicpath_profile");
          const localStamps = localStorage.getItem("civicpath_stamps");
          
          const newData: UserProfile = {
            email: currentUser.email || "",
            name: currentUser.displayName || "",
            uid: currentUser.uid,
            hasCompletedOnboarding: false,
            profile: {
              country: "in", countryName: "India", persona: "first-time", language: "en", interest: ""
            }
          };
          
          if (localProfile) {
            const parsedProfile = JSON.parse(localProfile);
            if (parsedProfile !== null) newData.profile = parsedProfile;
          }
          if (localStamps) {
            const parsedStamps = JSON.parse(localStamps);
            if (parsedStamps !== null) newData.stamps = parsedStamps;
          }
          
          try {
            await setDoc(userRef, newData);
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
          }
          setProfile(newData);
        }

        // Listen for changes
        unsubDoc = onSnapshot(userRef, (docSnap) => {
           if (docSnap.exists()) {
             setProfile(docSnap.data() as UserProfile);
           }
        }, (error) => {
           handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        });
        
        setLoading(false);

      } else {
        if (unsubDoc) {
          unsubDoc();
          unsubDoc = null;
        }
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) {
        unsubDoc();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      // Don't throw if the user simply closed the popup — that's intentional
      if (firebaseError.code === 'auth/popup-closed-by-user' || 
          firebaseError.code === 'auth/cancelled-popup-request') {
        return;
      }
      logger.error('Google Sign-In error:', firebaseError.code, firebaseError.message);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
    } catch (err) {
      logger.error('Registration failed', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      logger.error('Login failed', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("civicpath_profile");
    localStorage.removeItem("civicpath_stamps");
    localStorage.removeItem("civicpath_assistant_chat");
  };

  const saveProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, data, { merge: true });
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const contextValue = React.useMemo(
    () => ({ user, profile, loading, signInWithGoogle, registerWithEmail, loginWithEmail, logout, saveProfile }),
    [user, profile, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
