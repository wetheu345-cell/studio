'use client';
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Instructor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function InstructorProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const instructorRef = useMemo(() => firestore ? doc(firestore, 'instructors', params.id) : null, [firestore, params.id]);
  const { data: instructor, loading } = useDoc<Instructor>(instructorRef);


  if (loading) {
    return (
        <div className="container py-12 md:py-16">
             <Skeleton className="h-8 w-48 mb-8" />
             <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="md:col-span-1 flex flex-col items-center space-y-4">
                    <Skeleton className="aspect-square w-full max-w-[300px] rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-56" />
                </div>
             </div>
        </div>
    )
  }

  if (!instructor) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16">
        <Button variant="ghost" asChild className="mb-8">
            <Link href="/instructors"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Instructors</Link>
        </Button>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-[300px] rounded-full overflow-hidden shadow-lg">
            <Image
              src={instructor.imageUrl}
              alt={instructor.name}
              fill
              className="object-cover"
              data-ai-hint={instructor.imageHint}
            />
          </div>
          <div className="text-center mt-4">
            <h2 className="font-headline text-3xl font-bold">{instructor.name}</h2>
            <p className="text-muted-foreground text-lg">{instructor.specialty}</p>
            <div className="flex justify-center items-center gap-1 mt-2 text-amber-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <span className="text-muted-foreground ml-2">(18 reviews)</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="font-headline text-4xl font-bold border-b pb-4">About {instructor.name.split(' ')[0]}</h1>
          <div className="mt-6 space-y-4 font-body text-lg text-muted-foreground leading-relaxed">
            <p>{instructor.bio}</p>
            <p>With a deep love for horses and a commitment to safety, {instructor.name.split(' ')[0]} provides a supportive and enriching learning environment. Whether you're stepping into the saddle for the first time or perfecting your technique, you're in great hands.</p>
          </div>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href={`/booking/details?instructorId=${instructor.id}`}>Book a lesson with {instructor.name.split(' ')[0]}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
