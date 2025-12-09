
'use client';
import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import type { Lesson, Instructor } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SelectHorseDialog } from './_components/select-horse-dialog';
import { isAfter, addHours, format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

export default function MySchedulePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<(Lesson & { id: string }) | null>(null);
  const [lessonToCancel, setLessonToCancel] = useState<(Lesson & { id: string}) | null>(null);

  // This assumes the instructor's ID in the 'instructors' collection is the same as their user UID.
  // This needs to be robust. If an instructor document has a 'userId' field, that is better.
  const lessonsQuery = useMemo(() => 
    (firestore && user?.role === 'Instructor' ? query(collection(firestore, 'lessons'), where('instructorId', '==', user.uid)) : null),
    [firestore, user]
  );
  
  // A better approach if instructor documents have a userId
   const instructorsQuery = useMemo(() => 
    (firestore && user ? query(collection(firestore, 'instructors'), where('userId', '==', user.uid)) : null),
    [firestore, user]
  );
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsQuery);
  const instructor = instructors?.[0];

  const lessonsQueryFinal = useMemo(() => 
    (firestore && instructor ? query(collection(firestore, 'lessons'), where('instructorId', '==', instructor.id), where('status', '!=', 'Cancelled')) : null),
    [firestore, instructor]
  );

  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsQueryFinal);
  
  const loading = instructorsLoading || lessonsLoading;

  const isCancelable = (lesson: Lesson) => {
    const lessonDateTime = new Date(`${lesson.date}T${lesson.time}`);
    return isAfter(lessonDateTime, addHours(new Date(), 24));
  }

  const handleCancelLesson = () => {
    if (!firestore || !lessonToCancel) return;

    const lessonRef = doc(firestore, 'lessons', lessonToCancel.id);
    const lessonUpdate = { status: 'Cancelled' as const };
    updateDoc(lessonRef, lessonUpdate)
      .then(() => {
        toast({ title: "Lesson Cancelled", description: "The lesson has been successfully cancelled." });
        setLessonToCancel(null);
      })
      .catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: lessonRef.path,
            operation: 'update',
            requestResourceData: lessonUpdate,
          })
        );
      });
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="My Schedule" description="View and manage your upcoming lessons." />

      <Card className="mt-8">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rider</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Horse</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ))}
              {lessons?.map((lesson) => (
                <TableRow key={lesson.id} className={lesson.status === 'Cancelled' ? 'text-muted-foreground' : ''}>
                  <TableCell>{lesson.userName}</TableCell>
                  <TableCell>{format(new Date(lesson.date), 'PPP')} - {lesson.time}</TableCell>
                  <TableCell>{lesson.type}</TableCell>
                  <TableCell>
                    <Badge variant={lesson.status === 'Confirmed' ? 'default' : (lesson.status === 'Cancelled' ? 'destructive' : 'secondary')}>
                      {lesson.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lesson.horseId || 'Not Assigned'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedLesson(lesson)} disabled={lesson.status === 'Cancelled'}>
                      {lesson.horseId ? 'Change' : 'Select'} Horse
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => setLessonToCancel(lesson)}
                        disabled={!isCancelable(lesson) || lesson.status === 'Cancelled'}
                        title={!isCancelable(lesson) ? "Cannot cancel within 24 hours of the lesson" : ""}>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedLesson && (
        <SelectHorseDialog 
            lesson={selectedLesson}
            isOpen={!!selectedLesson}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedLesson(null)
                }
            }}
        />
      )}
      {lessonToCancel && (
        <AlertDialog open={!!lessonToCancel} onOpenChange={(isOpen) => !isOpen && setLessonToCancel(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will mark the lesson for {lessonToCancel.userName} on {format(new Date(lessonToCancel.date), 'PPP')} at {lessonToCancel.time} as cancelled.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Back</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelLesson}>Confirm Cancellation</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
