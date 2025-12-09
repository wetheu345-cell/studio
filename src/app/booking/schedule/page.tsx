'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
import type { Availability, Lesson } from '@/lib/types'
import { format, startOfWeek } from 'date-fns'

function BookingScheduleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string | undefined>()
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)

  const instructorId = searchParams.get('instructorId')
  const horseId = searchParams.get('horseId')
  const lessonType = searchParams.get('type') || 'Regular';

  const generateTimeSlots = (startTime: string, endTime: string, duration: number = 60): string[] => {
    const slots = [];
    let current = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    while (current < end) {
        slots.push(format(current, 'HH:mm'));
        current.setMinutes(current.getMinutes() + duration);
    }
    return slots;
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!firestore || !date || !instructorId || !horseId) {
        setAvailableTimes([]);
        return;
      }
      
      setIsLoadingTimes(true);
      setTime(undefined);

      try {
        const weekStart = startOfWeek(date);
        const weekStartDateStr = format(weekStart, 'yyyy-MM-dd');
        const selectedDateStr = format(date, 'yyyy-MM-dd');
        
        const availabilityQuery = query(
          collection(firestore, 'availability'),
          where('instructorId', '==', instructorId),
          where('weekStartDate', '==', weekStartDateStr)
        );
        const availabilitySnapshot = await getDocs(availabilityQuery);
        
        if (availabilitySnapshot.empty) {
          setAvailableTimes([]);
          setIsLoadingTimes(false);
          return;
        }

        const availabilityDoc = availabilitySnapshot.docs[0].data() as Availability;
        const allPossibleSlots = availabilityDoc.timeSlots
          .filter(slot => slot.date === selectedDateStr)
          .flatMap(slot => generateTimeSlots(slot.startTime, slot.endTime, 60))
          .sort((a,b) => a.localeCompare(b));
        
        if (allPossibleSlots.length === 0) {
            setAvailableTimes([]);
            setIsLoadingTimes(false);
            return;
        }

        const selectedDayString = date.toISOString().split('T')[0];

        const instructorLessonsQuery = query(
          collection(firestore, 'lessons'), 
          where('instructorId', '==', instructorId),
          where('date', '==', selectedDayString)
        );
        const horseLessonsQuery = query(
          collection(firestore, 'lessons'), 
          where('horseId', '==', horseId),
          where('date', '==', selectedDayString)
        );

        const [instructorLessonsSnapshot, horseLessonsSnapshot] = await Promise.all([
          getDocs(instructorLessonsQuery),
          getDocs(horseLessonsQuery)
        ]);
        
        const bookedTimes = new Set<string>();
        
        const processSnapshot = (snapshot: any) => {
             snapshot.docs.forEach((doc: any) => {
                const lesson = doc.data() as Lesson;
                if (lesson.status !== 'Cancelled') {
                    bookedTimes.add(lesson.time);
                }
            });
        }
       
        processSnapshot(instructorLessonsSnapshot);
        processSnapshot(horseLessonsSnapshot);

        const trulyAvailableTimes = allPossibleSlots.filter(slot => !bookedTimes.has(slot));
        
        setAvailableTimes(trulyAvailableTimes);

      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load availability." });
        setAvailableTimes([]);
      } finally {
        setIsLoadingTimes(false);
      }
    };

    fetchAvailability();
  }, [date, instructorId, horseId, firestore, toast]);


  const handleNext = async () => {
    if (!date || !time) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select a date and time.",
        })
      return
    }
    
    if (!user) {
        const params = new URLSearchParams(searchParams.toString())
        if (date) params.set('date', date.toISOString())
        if (time) params.set('time', time)
        const callbackUrl = `${pathname}?${params.toString()}`;
        router.push(`/login?redirect=${encodeURIComponent(callbackUrl)}`);
        return;
    }

    if (!firestore) {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not connect to the database.",
        })
        return;
    }

    const lessonData = {
      type: lessonType,
      horseId,
      instructorId,
      date: format(date, 'yyyy-MM-dd'),
      time,
      userId: user.uid,
      userName: user.displayName || user.email || 'Unknown User',
      status: 'Pending' as 'Pending',
    }

    try {
      const collectionRef = collection(firestore, 'lessons');
      const docRef = await addDoc(collectionRef, lessonData);
      
      const params = new URLSearchParams(searchParams.toString())
      params.set('date', date.toISOString())
      params.set('time', time)
      params.set('lessonId', docRef.id)
      router.push(`/booking/confirm?${params.toString()}`)
    } catch (error) {
       const collectionRef = collection(firestore, 'lessons');
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
              <SelectValue placeholder={isLoadingTimes ? "Loading times..." : (availableTimes.length > 0 ? "Select a time" : "No times available")} />
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
          {isUserLoading ? 'Loading...' : 'Next: Confirm'}
        </Button>
      </div>
    </div>
  )
}

export default function BookingSchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingScheduleContent />
    </Suspense>
  )
}
