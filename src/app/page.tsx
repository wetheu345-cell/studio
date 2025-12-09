'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HorseCard } from '@/components/horse-card';
import { InstructorCard } from '@/components/instructor-card';
import { useCollection, useFirestore } from '@/firebase';
import { Horse, Instructor } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const firestore = useFirestore();

  const horsesCollection = useMemo(() => (firestore ? collection(firestore, 'horses') : null), [firestore]);
  const instructorsCollection = useMemo(() => (firestore ? collection(firestore, 'instructors') : null), [firestore]);

  const { data: horses, isLoading: horsesLoading } = useCollection<Horse>(horsesCollection);
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);


  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Horse riding"
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-wider">
            EHW
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl font-body">
            Experience the joy and therapeutic power of horseback riding. Join our community and embark on an unforgettable journey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              <Link href="/booking">
                Book a Lesson <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-black font-bold">
              <Link href="/horses">
                Meet The Horses
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section id="lessons" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-wide sm:text-5xl font-headline">Choose Your Experience</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                We offer a variety of lessons tailored to your needs, whether you're looking for recreation or therapy.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 mt-12">
            <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-wide">Regular Lessons</CardTitle>
                <CardDescription>For all skill levels, from beginners to advanced riders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent"/> Skill development</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent"/> Private and group options</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent"/> Focus on horsemanship</li>
                </ul>
                <Button asChild className="w-full bg-primary text-primary-foreground mt-4">
                  <Link href="/booking?type=Regular">Book Regular Lesson</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-wide">Therapy Lessons</CardTitle>
                <CardDescription>Utilizing horses to promote emotional growth and learning.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <ul className="space-y-2 text-muted-foreground">
                   <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent"/> Certified instructors</li>
                   <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent"/> Safe and supportive environment</li>
                   <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent"/> Builds confidence and trust</li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground mt-4">
                  <Link href="/booking?type=Therapy">Book Therapy Session</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="horses" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-wide sm:text-5xl font-headline">Meet Our Gentle Giants</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed font-body">
              Our horses are the heart of our program. Each has a unique personality and is trained to work with riders of all abilities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {horsesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="w-full aspect-[4/3]" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              horses?.slice(0, 4).map((horse) => (
                <HorseCard key={horse.id} horse={horse} />
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/horses">View All Horses <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="instructors" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-wide sm:text-5xl font-headline">Our Expert Instructors</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed font-body">
              Learn from the best. Our instructors are passionate, experienced, and dedicated to your success and well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
             {instructorsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="w-full aspect-square" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))
            ) : (
                instructors?.slice(0, 4).map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
                ))
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/instructors">Meet All Instructors <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
