
'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addDoc, collection } from 'firebase/firestore'
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase'
import { PageHeader } from '@/components/page-header'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Phone } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const generateTimeSlots = (start: number, end: number) => {
  const slots = []
  for (let i = start; i < end; i++) {
    slots.push(`${i}:00`)
    slots.push(`${i}:30`)
  }
  return slots
}

const weekDaySlots = generateTimeSlots(10, 16); // 10am to 4pm (16:00)
const weekendSlots = generateTimeSlots(10, 15); // 10am to 3pm (15:00)

export default function BookingSchedulePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string | undefined>()

  const day = date?.getDay()
  const availableTimes = day === 0 || day === 6 ? weekendSlots : weekDaySlots

  const handleNext = async () => {
    if (!date || !time || !user || !firestore) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select a date and time, and make sure you are logged in.",
        })
      return
    }

    const lessonData = {
      type: searchParams.get('type') || 'Regular',
      horseId: searchParams.get('horseId'),
      instructorId: searchParams.get('instructorId'),
      date: date.toISOString(),
      time,
      userId: user.uid,
      userName: user.displayName || user.email || 'Unknown User',
      status: 'Pending',
    }

    const collectionRef = collection(firestore, 'lessons');
    addDoc(collectionRef, lessonData)
      .then(docRef => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('date', date.toISOString())
        params.set('time', time)
        params.set('lessonId', docRef.id)
        router.push(`/booking/confirm?${params.toString()}`)
      })
      .catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: lessonData
          })
        );
      });
  }

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        title="Schedule Your Lesson"
        description="Select a date and time that works best for you."
      />

      <div className="mt-8 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
            <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(day) => day < new Date(new Date().toDateString())}
            />
             <Alert>
                <Phone className="h-4 w-4" />
                <AlertTitle>By Appointment Only</AlertTitle>
                <AlertDescription>
                    <p>Mon-Fri: 10am - 4pm</p>
                    <p>Sat-Sun: 10am - 3pm</p>
                    <p className="mt-2">Call to inquire: (860) 293-2914 (M-F, 9-4)</p>
                </AlertDescription>
            </Alert>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Available Time Slots</h3>
          <Select onValueChange={setTime} value={time}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

       <div className="mt-12 w-full max-w-4xl flex justify-end">
        <Button size="lg" onClick={handleNext} disabled={!date || !time || isUserLoading}>
          Next: Confirm
        </Button>
      </div>
    </div>
  )
}
