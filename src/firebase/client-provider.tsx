'use client';

import React from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider, FirebaseContextValue } from './provider';

let firebaseContextValue: FirebaseContextValue;

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!firebaseContextValue) {
    firebaseContextValue = initializeFirebase();
  }
  return (
    <FirebaseProvider value={firebaseContextValue}>{children}</FirebaseProvider>
  );
}
