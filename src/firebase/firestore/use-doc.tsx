'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export type DocData<T> = {
  loading: boolean;
  data: (T & { id: string }) | null;
  error: FirestoreError | null;
};

export function useDoc<T>(
  docRef: DocumentReference | null
): DocData<T> {
  const [data, setData] = useState<DocData<T>['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const docRefRef = useRef(docRef);
  docRefRef.current = docRef;

  useEffect(() => {
    if (!docRefRef.current) {
        setLoading(false);
        return;
    }
    const unsubscribe = onSnapshot(
      docRefRef.current,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const docData = {
            id: snapshot.id,
            ...snapshot.data(),
          } as T & { id: string };
          setData(docData);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef?.path]);

  return { data, loading, error };
}
