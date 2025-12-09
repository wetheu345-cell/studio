'use client';
import React, { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

export type FirebaseContextValue = {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export type FirebaseProviderProps = {
  children: React.ReactNode;
  value: FirebaseContextValue;
};

export function FirebaseProvider({
  children,
  value,
}: FirebaseProviderProps): JSX.Element {
  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().firebaseApp;
}

export function useFirestore() {
  return useFirebase().firestore;
}

export function useAuth() {
  return useFirebase().auth;
}
