
'use client';
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Calendar } from "@/components/ui/calendar"
import { useCollection, useFirestore } from "@/firebase";
import type { Lesson, Instructor, Horse } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { LessonCard } from "./_components/lesson-card";
import { format } from "date-fns";

export default function AdminSchedulePage() {
  const firestore = useFirestore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const lessonsCollection = useMemo(() => firestore ? collection(firestore, 'lessons') : null, [firestore]);
  const instructorsCollection = useMemo(() => firestore ? collection(firestore, 'instructors') : null, [firestore]);
  const horsesCollection = useMemo(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  
  const selectedDayString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const lessonsQuery = useMemo(() => 
    lessonsCollection && selectedDayString ? query(lessonsCollection, where('date', '==', selectedDayString)) : null,
  [lessonsCollection, selectedDayString]);

  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);
  const { data: horses, isLoading: horsesLoading } = useCollection<Horse>(horsesCollection);

  const loading = lessonsLoading || instructorsLoading || horsesLoading;

  const allScheduledDaysQuery = useMemo(() => firestore ? collection(firestore, 'lessons') : null, [firestore]);
  const { data: allLessons } = useCollection<Lesson>(allScheduledDaysQuery);

  const scheduledDays = useMemo(() => {
    return allLessons?.map(lesson => new Date(lesson.date)) || [];
  }, [allLessons]);


  const lessonsOnSelectedDay = useMemo(() => {
    if (!lessons) return [];
    return lessons.sort((a, b) => a.time.localeCompare(b.time));
  }, [lessons]);

  const instructorsMap = useMemo(() => {
    if (!instructors) return new Map();
    return new Map(instructors.map(i => [i.id, i]));
  }, [instructors]);

  const horsesMap = useMemo(() => {
    if (!horses) return new Map();
    return new Map(horses.map(h => [h.id, h]));
  }, [horses]);

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <PageHeader 
        title="Full Schedule" 
        description="View all scheduled lessons for any day. Select a day from the calendar to see details." 
        className="px-0 text-left items-start"
      />
      <div className="mt-8 grid gap-8 md:grid-cols-3 flex-1">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ scheduled: scheduledDays }}
                modifiersStyles={{ 
                  scheduled: { 
                    border: "2px solid hsl(var(--accent))",
                    borderRadius: 'var(--radius)',
                  }
                }}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 flex flex-col">
            <h2 className="text-2xl font-headline mb-4">
                Lessons for {selectedDate ? format(selectedDate, 'PPP') : '...'}
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loading ? (
                Array.from({length: 3}).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-6 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <div className="h-4 bg-muted rounded w-full"></div>
                           <div className="h-4 bg-muted rounded w-full"></div>
                           <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardContent>
                    </Card>
                ))
            ) : lessonsOnSelectedDay.length > 0 ? (
                <div className="space-y-4">
                    {lessonsOnSelectedDay.map(lesson => (
                        <LessonCard 
                            key={lesson.id} 
                            lesson={lesson}
                            instructor={instructorsMap.get(lesson.instructorId)}
                            horse={horsesMap.get(lesson.horseId)}
                            allHorses={horses || []}
                        />
                    ))}
                </div>
            ) : (
                <Card className="flex items-center justify-center h-full">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>No lessons scheduled for this day.</p>
                    </CardContent>
                </Card>
            )}
            </div>
        </div>
      </div>
    </div>
  )
}
