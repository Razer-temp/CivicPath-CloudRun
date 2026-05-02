import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export const LoginPage = () => {
  const { user, loading, signInWithGoogle, registerWithEmail, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  /** Maps Firebase auth error codes to user-friendly messages */
  const parseFirebaseError = (err: { code?: string; message?: string }): string => {
    switch (err.code) {
      // Email/Password errors
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please enable it in the Firebase Console → Authentication → Sign-in method.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password. Are you sure you have created an account?';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please switch to Sign In.';
      case 'auth/weak-password':
        return 'Password is too weak (minimum 6 characters).';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a minute and try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      // Google Sign-In specific errors
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for sign-in. Add it to Firebase Console → Authentication → Settings → Authorized domains.';
      case 'auth/internal-error':
        return 'Google Sign-In failed. Please ensure the Google provider is enabled in Firebase Console → Authentication → Sign-in method.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account with this email already exists using a different sign-in method. Try signing in with email/password instead.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      default:
        return err.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setAuthError(parseFirebaseError(firebaseErr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setAuthError(parseFirebaseError(firebaseErr));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[80px] opacity-50 translate-y-1/3 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl p-8 relative z-10"
      >
        <div className="w-16 h-16 bg-civic-blue text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/20">
          <Globe className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-center text-slate-800 tracking-tight mb-2">Welcome to CivicPath</h1>
        <p className="text-center text-slate-500 font-medium mb-8">
          {isSignUp ? "Create your verified civic identity." : "Sign in to continue your democratic journey."}
        </p>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <AnimatePresence mode="popLayout">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <label htmlFor="name-input" className="sr-only">Full Name</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="name-input"
                  type="text"
                  required={isSignUp}
                  maxLength={100}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all font-medium"
                  placeholder="Full Name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <label htmlFor="email-input" className="sr-only">Email address</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              id="email-input"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all font-medium"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <label htmlFor="password-input" className="sr-only">Password</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              id="password-input"
              type="password"
              required
              maxLength={128}
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all font-medium"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-2 bg-civic-blue text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-400 font-medium tracking-wide">OR</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading || isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-50 hover:border-blue-200 hover:text-civic-blue transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError('');
            }}
            className="text-sm font-bold text-slate-500 hover:text-civic-blue transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secure, verified access.
        </div>
      </motion.div>
    </div>
  );
};
