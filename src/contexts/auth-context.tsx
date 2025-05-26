
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile, // Import updateProfile
  type AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>; // Expose setLoading if needed by other components like EditProfile
  error: string | null;
  signUp: (email: string, pass: string, displayName: string) => Promise<boolean>;
  logIn: (email: string, pass: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  setError: Dispatch<SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, displayName: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // After user is created, update their profile with the display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      toast({ title: "Signup Successful", description: "You have been registered." });
      router.push('/'); // Redirect to home or profile page
      return true;
    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
      toast({ title: "Signup Failed", description: authError.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/'); // Redirect to home or profile page
      return true;
    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
      toast({ title: "Login Failed", description: authError.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      toast({ title: "Logged Out", description: "You have been logged out successfully." });
      router.push('/login');
    } catch (e) {
      const authError = e as AuthError;
      setError(authError.message);
      toast({ title: "Logout Failed", description: authError.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    setLoading, // Expose setLoading
    error,
    signUp,
    logIn,
    logOut,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
