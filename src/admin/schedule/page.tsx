
'use client';
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Calendar } from "@/components/ui/calendar"
import { useCollection, useFirestore } from "@/firebase";
import type { Lesson, Instructor, Horse } from "@/lib/types";
import { collection } from "firebase/firestore";
import { LessonCard } from "./_components/lesson-card";

export default function AdminSchedulePage() {
  const firestore = useFirestore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const lessonsCollection = useMemo(() => firestore ? collection(firestore, 'lessons') : null, [firestore]);
  const instructorsCollection = useMemo(() => firestore ? collection(firestore, 'instructors') : null, [firestore]);
  const horsesCollection = useMemo(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  
  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsCollection);
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);
  const { data: horses, isLoading: horsesLoading } = useCollection<Horse>(horsesCollection);

  const loading = lessonsLoading || instructorsLoading || horsesLoading;

  const scheduledDays = useMemo(() => {
    return lessons?.map(lesson => new Date(lesson.date.split('T')[0])) || [];
  }, [lessons]);

  const lessonsOnSelectedDay = useMemo(() => {
    if (!lessons || !selectedDate) return [];
    
    const selectedDayString = selectedDate.toISOString().split('T')[0];

    return lessons
      .filter(lesson => lesson.date.startsWith(selectedDayString))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [lessons, selectedDate]);

  const instructorsMap = useMemo(() => {
    if (!instructors) return new Map();
    return new Map(instructors.map(i => [i.id, i]));
  }, [instructors]);

  const horsesMap = useMemo(() => {
    if (!horses) return new Map();
    return new Map(horses.map(h => [h.id, h]));
  }, [horses]);

  return (
    <div className="p-4 md:p-8">
      <PageHeader 
        title="Full Schedule" 
        description="View all scheduled lessons. Click a day to see details." 
        className="text-left px-0"
      />
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ scheduled: scheduledDays }}
                modifiersStyles={{ scheduled: {
                    border: "2px solid hsl(var(--accent))",
                    borderRadius: '50%',
                 } }}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <h2 className="text-2xl font-headline mb-4">
                Lessons for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '...'}
            </h2>
            {loading ? (
                <div className="space-y-4">
                    <Card><CardContent className="pt-6"><p>Loading...</p></CardContent></Card>
                </div>
            ) : lessonsOnSelectedDay.length > 0 ? (
                <div className="space-y-4">
                    {lessonsOnSelectedDay.map(lesson => (
                        <LessonCard 
                            key={lesson.id} 
                            lesson={lesson}
                            instructor={instructorsMap.get(lesson.instructorId)}
                            horse={horsesMap.get(lesson.horseId)}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>No lessons scheduled for this day.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  )
}
