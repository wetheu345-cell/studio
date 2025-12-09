
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
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
import type { Availability } from '@/lib/types'
import { format, startOfWeek } from 'date-fns'

export default function BookingSchedulePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string | undefined>()
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)

  const instructorId = searchParams.get('instructorId')

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!firestore || !date || !instructorId) {
        setAvailableTimes([]);
        return;
      }
      
      setIsLoadingTimes(true);
      setTime(undefined); // Reset selected time when date changes

      try {
        const weekStart = startOfWeek(date);
        const weekStartDateStr = format(weekStart, 'yyyy-MM-dd');
        const selectedDateStr = format(date, 'yyyy-MM-dd');
        
        const q = query(
          collection(firestore, 'availability'),
          where('instructorId', '==', instructorId),
          where('weekStartDate', '==', weekStartDateStr)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setAvailableTimes([]);
          return;
        }

        const availabilityDoc = querySnapshot.docs[0].data() as Availability;
        const slotsForDay = availabilityDoc.timeSlots
          .filter(slot => slot.date === selectedDateStr)
          .flatMap(slot => {
              const start = parseInt(slot.startTime.split(':')[0]);
              const end = parseInt(slot.endTime.split(':')[0]);
              const times = [];
              for (let i = start; i < end; i++) {
                  times.push(`${String(i).padStart(2, '0')}:00`);
                  times.push(`${String(i).padStart(2, '0')}:30`);
              }
              // Don't include the end time itself unless it's on the hour
              if(slot.endTime.split(':')[1] === '00') {
                  return times;
              } else {
                  return times.slice(0, -1);
              }
          })
          .sort((a,b) => a.localeCompare(b));
        
        setAvailableTimes(slotsForDay);

      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load availability." });
        setAvailableTimes([]);
      } finally {
        setIsLoadingTimes(false);
      }
    };

    fetchAvailability();
  }, [date, instructorId, firestore, toast]);


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
      status: 'Pending' as 'Pending',
    }

    const collectionRef = collection(firestore, 'lessons');
    try {
        const docRef = await addDoc(collectionRef, lessonData)
        const params = new URLSearchParams(searchParams.toString())
        params.set('date', date.toISOString())
        params.set('time', time)
        params.set('lessonId', docRef.id)
        router.push(`/booking/confirm?${params.toString()}`)
    } catch (error) {
         errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: lessonData
          })
        );
    }
  }

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        title="Schedule Your Lesson"
        description="Select an available date and time with your chosen instructor."
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
                    <p>Select a date to see your instructor's available times.</p>
                    <p className="mt-2">Call to inquire: (860) 293-2914 (M-F, 9-4)</p>
                </AlertDescription>
            </Alert>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Available Time Slots for {date ? format(date, 'MMMM do') : '...'}</h3>
          <Select onValueChange={setTime} value={time} disabled={isLoadingTimes || availableTimes.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingTimes ? "Loading times..." : "Select a time"} />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.length > 0 ? (
                availableTimes.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-times" disabled>No available times for this day</SelectItem>
              )}
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
