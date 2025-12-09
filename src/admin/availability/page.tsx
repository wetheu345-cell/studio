
'use client';
import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Instructor, Availability } from '@/lib/types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { PlusCircle, Trash2 } from 'lucide-react';

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = [];
  for (let i = startHour; i < endHour; i++) {
    slots.push(`${String(i).padStart(2, '0')}:00`);
    slots.push(`${String(i).padStart(2, '0')}:30`);
  }
  return slots;
};

export default function AvailabilityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  
  const instructorsQuery = useMemo(() => 
    (firestore && user ? query(collection(firestore, 'instructors'), where('userId', '==', user.uid)) : null),
    [firestore, user]
  );
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsQuery);
  const instructor = instructors?.[0];

  const weekStart = startOfWeek(selectedDate);
  const availabilityQuery = useMemo(() => 
    (firestore && instructor ? query(collection(firestore, 'availability'), where('instructorId', '==', instructor.id), where('weekStartDate', '==', format(weekStart, 'yyyy-MM-dd'))) : null),
    [firestore, instructor, weekStart]
  );
  const { data: availabilityDocs, isLoading: availabilityLoading } = useCollection<Availability>(availabilityQuery);
  const availability = availabilityDocs?.[0];

  const timeSlotsForSelectedDay = useMemo(() => {
    if (!availability) return [];
    return availability.timeSlots
      .filter(slot => isSameDay(new Date(slot.date), selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [availability, selectedDate]);

  const timeOptions = generateTimeSlots(8, 20); // 8am to 8pm

  const handleAddTimeSlot = async () => {
    if (!firestore || !instructor || !startTime || !endTime) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a start and end time.' });
      return;
    }
    if (startTime >= endTime) {
      toast({ variant: 'destructive', title: 'Error', description: 'End time must be after start time.' });
      return;
    }

    const newSlot = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
    };
    
    try {
        let availabilityDocRef;
        let newTimeSlots;
        let operation: 'create' | 'update' = 'create';
        let existingDocId: string | undefined = undefined;

        // Check if an availability document for this week already exists
        const weekStartDateStr = format(weekStart, 'yyyy-MM-dd');
        const q = query(collection(firestore, 'availability'), where('instructorId', '==', instructor.id), where('weekStartDate', '==', weekStartDateStr));
        const existingDocs = await getDocs(q);

        if (existingDocs.docs.length > 0) {
            const existingDoc = existingDocs.docs[0];
            existingDocId = existingDoc.id;
            const existingData = existingDoc.data() as Availability;
            newTimeSlots = [...existingData.timeSlots, newSlot];
            operation = 'update';
        } else {
            newTimeSlots = [newSlot];
        }

        const availabilityData = {
            instructorId: instructor.id,
            weekStartDate: weekStartDateStr,
            timeSlots: newTimeSlots
        };

        if (operation === 'update' && existingDocId) {
            availabilityDocRef = doc(firestore, 'availability', existingDocId);
            await updateDoc(availabilityDocRef, availabilityData);
        } else {
            availabilityDocRef = collection(firestore, 'availability');
            await addDoc(availabilityDocRef, availabilityData);
        }

        toast({ title: 'Success', description: 'Availability updated.' });
        setStartTime('');
        setEndTime('');
    } catch (error) {
        console.error("Error adding time slot:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update availability.' });
    }
  };

  const handleRemoveTimeSlot = async (slotToRemove: { date: string; startTime: string; endTime: string; }) => {
     if (!firestore || !availability) return;

     const newTimeSlots = availability.timeSlots.filter(slot => 
         !(slot.date === slotToRemove.date && slot.startTime === slotToRemove.startTime && slot.endTime === slotToRemove.endTime)
     );
     
     const availabilityDocRef = doc(firestore, 'availability', availability.id);
     updateDoc(availabilityDocRef, { timeSlots: newTimeSlots })
        .then(() => {
            toast({ title: 'Success', description: 'Time slot removed.' });
        })
        .catch(error => {
             errorEmitter.emit('permission-error', new FirestorePermissionError({ path: availabilityDocRef.path, operation: 'update', requestResourceData: { timeSlots: newTimeSlots } }));
        });
  };
  
  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="My Availability"
        description="Set your available hours for the upcoming week so clients can book lessons with you."
        className="text-left px-0"
      />

      <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
                <CardTitle>Week View</CardTitle>
                <CardDescription>Select a day to manage your time slots.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                />
            </CardContent>
        </Card>
        
        <Card>
             <CardHeader>
                <CardTitle>Manage Time Slots for {format(selectedDate, 'MMMM do')}</CardTitle>
                <CardDescription>Add or remove your working hours for the selected day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h4 className="font-medium">Add New Slot</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Select value={startTime} onValueChange={setStartTime}>
                            <SelectTrigger><SelectValue placeholder="Start Time" /></SelectTrigger>
                            <SelectContent>{timeOptions.map(t => <SelectItem key={`start-${t}`} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={endTime} onValueChange={setEndTime}>
                            <SelectTrigger><SelectValue placeholder="End Time" /></SelectTrigger>
                            <SelectContent>{timeOptions.map(t => <SelectItem key={`end-${t}`} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAddTimeSlot} disabled={instructorsLoading || !instructor}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Time Slot
                    </Button>
                </div>
                <div className="space-y-2">
                    <h4 className="font-medium">Existing Slots</h4>
                    {availabilityLoading && <p>Loading...</p>}
                    {!availabilityLoading && timeSlotsForSelectedDay.length === 0 && (
                        <p className="text-sm text-muted-foreground">No time slots set for this day.</p>
                    )}
                    <div className="space-y-2">
                        {timeSlotsForSelectedDay.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                <p>{slot.startTime} - {slot.endTime}</p>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveTimeSlot(slot)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
