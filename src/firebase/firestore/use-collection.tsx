'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export type CollectionData<T> = {
  loading: boolean;
  data: (T & { id: string })[] | null;
  error: FirestoreError | null;
};

export function useCollection<T>(
  query: Query | null
): CollectionData<T> {
  const [data, setData] = useState<CollectionData<T>['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    if (!queryRef.current) {
        setLoading(false);
        return;
    }
    const unsubscribe = onSnapshot(
      queryRef.current,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as T & { id: string })
        );
        setData(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query?.path, query?.where]);

  return { data, loading, error };
}
