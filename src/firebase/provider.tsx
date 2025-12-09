
'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useUser as useAppUserHook, type AuthState } from './auth/use-user'; 

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface FirebaseContextState extends AuthState {
  areServicesAvailable: boolean; 
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; 
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const authState = useAppUserHook(auth, firestore);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      ...authState,
    };
  }, [firebaseApp, firestore, auth, authState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): Omit<FirebaseContextState, 'areServicesAvailable'> => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    firebaseUser: context.firebaseUser,
    isUserLoading: context.isUserLoading,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error('Auth service not available');
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error('Firestore service not available');
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error('Firebase App not available');
  return firebaseApp;
};

export const useUser = (): AuthState => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a FirebaseProvider.');
    }
    const { firebaseUser, user, isUserLoading } = context;
    return { firebaseUser, user, isUserLoading };
};
