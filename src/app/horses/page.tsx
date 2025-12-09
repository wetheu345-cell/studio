
'use client';
import { HorseCard } from "@/components/horse-card"
import { PageHeader } from "@/components/page-header"
import { useCollection, useFirestore } from "@/firebase";
import { Horse } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function HorsesPage() {
  const firestore = useFirestore();
  const horsesCollection = useMemo(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  const { data: horses, loading } = useCollection<Horse>(horsesCollection);

  return (
    <div className="container py-12 md:py-16">
      <PageHeader
        title="Meet Our Gentle Giants"
        description="Our horses are the heart of our program. Each has a unique personality and is trained to work with riders of all abilities."
      />
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-[4/3]" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        ))}
        {horses?.map((horse) => (
          <HorseCard key={horse.id} horse={horse} />
        ))}
      </div>
    </div>
  )
}
