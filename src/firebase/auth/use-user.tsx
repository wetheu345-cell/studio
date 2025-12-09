
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

export function useUser(auth: Auth, firestore: Firestore) {
  const [authState, setAuthState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    isUserLoading: true,
  });

  const userDocRef = useMemo(() => {
    if (firestore && authState.firebaseUser) {
      return doc(firestore, 'users', authState.firebaseUser.uid);
    }
    return null;
  }, [firestore, authState.firebaseUser]);

  const { data: user, isLoading: isUserDocLoading } = useDoc<AppUser>(userDocRef);

  useEffect(() => {
    if (!auth) {
        setAuthState({ firebaseUser: null, user: null, isUserLoading: false });
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setAuthState(current => ({ ...current, firebaseUser, isUserLoading: true }));
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (authState.firebaseUser === null) { // User logged out
        setAuthState({ firebaseUser: null, user: null, isUserLoading: false });
    } else if (!isUserDocLoading) { // User is logged in, and we've finished loading their app data
        setAuthState(current => ({ ...current, user, isUserLoading: false }));
    }
  }, [authState.firebaseUser, user, isUserDocLoading]);
  
  return authState;
}
