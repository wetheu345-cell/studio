'use client'
import { useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useDoc, useFirestore } from '@/firebase'
import { doc } from 'firebase/firestore'
import type { Horse, Instructor } from '@/lib/types'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Heart, User, Calendar, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const firestore = useFirestore()

  const horseId = searchParams.get('horseId')
  const instructorId = searchParams.get('instructorId')
  const lessonType = searchParams.get('type')
  const dateStr = searchParams.get('date')
  const time = searchParams.get('time')

  const horseRef = useMemo(() => (firestore && horseId) ? doc(firestore, 'horses', horseId) : null, [firestore, horseId]);
  const instructorRef = useMemo(() => (firestore && instructorId) ? doc(firestore, 'instructors', instructorId) : null, [firestore, instructorId]);
  
  const { data: horse, isLoading: horseLoading } = useDoc<Horse>(horseRef);
  const { data: instructor, isLoading: instructorLoading } = useDoc<Instructor>(instructorRef);
  
  const loading = horseLoading || instructorLoading

  const lessonDate = dateStr ? new Date(dateStr) : null

  const paymentLink = "https://www.paypal.com/paypalme/HealRideLearn?country.x=US&locale.x=en_US";

  return (
    <div className="container py-12">
      <PageHeader
        title="Booking Confirmation"
        description="Your lesson is reserved! Please complete payment to confirm."
      />

      <div className="mt-12 w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Summary</CardTitle>
            <CardDescription>Review your details below. Your spot is held for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
            ) : (
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center"><Calendar className="mr-3 h-5 w-5 text-accent" /> {lessonDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li className="flex items-center"><Clock className="mr-3 h-5 w-5 text-accent" /> {time}</li>
                  <li className="flex items-center"><CheckCircle className="mr-3 h-5 w-5 text-accent" /> {lessonType} Lesson</li>
                  {horse && <li className="flex items-center"><Heart className="mr-3 h-5 w-5 text-accent" /> With {horse.name}</li>}
                  {instructor && <li className="flex items-center"><User className="mr-3 h-5 w-5 text-accent" /> With {instructor.name}</li>}
                </ul>
            )}
            <Button size="lg" className="w-full mt-4" asChild>
                <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                    Proceed to Payment
                </a>
            </Button>
            <p className="text-xs text-center text-muted-foreground pt-2">
                After payment, your booking status will be updated to "Confirmed".
            </p>
          </CardContent>
        </Card>
         <div className="mt-8 text-center">
            <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </div>
    </div>
  )
}


export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  )
}
