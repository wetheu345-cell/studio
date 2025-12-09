'use client';
import { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser, Auth } from 'firebase/auth';
import { useDoc } from '../firestore/use-doc';
import { doc, Firestore } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/types';


export interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: AppUser | null;
  isUserLoading: boolean;
}

// This hook now takes auth and firestore instances as arguments
// to break the circular dependency.
export function useUser(auth: Auth, firestore: Firestore): AuthState {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Effect for subscribing to Firebase Auth state changes
  useEffect(() => {
    if (!auth) {
        setIsAuthLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
        setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  
  // Memoize the document reference to prevent re-renders
  const userDocRef = useMemo(() => {
    if (firestore && firebaseUser) {
      return doc(firestore, 'users', firebaseUser.uid);
    }
    return null;
  }, [firestore, firebaseUser]);

  // useDoc hook to get the user's application-specific data
  const { data: user, isLoading: isUserDocLoading } = useDoc<AppUser>(userDocRef);

  const isUserLoading = isAuthLoading || (!!firebaseUser && isUserDocLoading);
  
  return {
      firebaseUser,
      user: user,
      isUserLoading: isUserLoading
  };
}
