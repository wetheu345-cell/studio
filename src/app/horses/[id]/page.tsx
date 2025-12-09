
'use client';
import Image from "next/image"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Horse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function HorseProfilePage() {
  const params = useParams();
  const firestore = useFirestore();
  const horseId = params.id as string;

  const horseRef = useMemo(() => firestore ? doc(firestore, 'horses', horseId) : null, [firestore, horseId]);
  const { data: horse, loading } = useDoc<Horse>(horseRef);

  if (loading) {
    return (
        <div className="container py-12 md:py-16">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="aspect-square md:aspect-auto h-full min-h-[300px] md:min-h-[500px] rounded-lg" />
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-48" />
                </div>
            </div>
        </div>
    )
  }

  if (!horse) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/horses"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Horses</Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square md:aspect-auto h-full min-h-[300px] md:min-h-[500px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src={horse.imageUrl}
            alt={horse.name}
            fill
            className="object-cover"
            data-ai-hint={horse.imageHint}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-wide">{horse.name}</h1>
          <p className="text-muted-foreground text-lg mt-2">{horse.breed}</p>
          
          <div className="mt-6 space-y-4 font-body text-lg">
            <p>{horse.description}</p>
            <div className="flex flex-wrap gap-4 items-center">
                <div className="font-semibold">Age: {horse.age} years</div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Best For:</span>
                    <Badge variant={horse.suitability === 'Therapy' ? 'destructive' : 'secondary'}>{horse.suitability}</Badge>
                </div>
            </div>
          </div>

          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href={`/booking/details?horseId=${horse.id}`}>Book a lesson with {horse.name}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
