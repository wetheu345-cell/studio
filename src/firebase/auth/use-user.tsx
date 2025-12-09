
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
  const [authState, setAuthState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    isUserLoading: true,
  });

  // Effect for subscribing to Firebase Auth state changes
  useEffect(() => {
    if (!auth) {
        setAuthState({ firebaseUser: null, user: null, isUserLoading: false });
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setAuthState(current => ({ ...current, firebaseUser, isUserLoading: !!firebaseUser }));
    });

    return () => unsubscribe();
  }, [auth]);
  
  // Memoize the document reference to prevent re-renders
  const userDocRef = useMemo(() => {
    if (firestore && authState.firebaseUser) {
      return doc(firestore, 'users', authState.firebaseUser.uid);
    }
    return null;
  }, [firestore, authState.firebaseUser]);

  // useDoc hook to get the user's application-specific data
  const { data: user, isLoading: isUserDocLoading } = useDoc<AppUser>(userDocRef);

  // Effect to combine auth state with Firestore user data
  useEffect(() => {
    if (authState.firebaseUser === null) { // User is logged out
        setAuthState({ firebaseUser: null, user: null, isUserLoading: false });
    } else if (!isUserDocLoading) { // User is logged in, and we've finished loading their app data
        setAuthState(current => ({ ...current, user, isUserLoading: false }));
    }
  }, [authState.firebaseUser, user, isUserDocLoading]);
  
  return authState;
}
