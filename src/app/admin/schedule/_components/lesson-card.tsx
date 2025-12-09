'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lesson, Instructor, Horse } from "@/lib/types";
import { Clock, User, Heart, Edit, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { SelectHorseDialog } from '../../my-schedule/_components/select-horse-dialog';

interface LessonCardProps {
    lesson: Lesson;
    instructor?: Instructor;
    horse?: Horse;
    allHorses: Horse[];
}

export function LessonCard({ lesson, instructor, horse, allHorses }: LessonCardProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [lessonToCancel, setLessonToCancel] = useState<(Lesson & { id: string}) | null>(null);
    const [lessonToEdit, setLessonToEdit] = useState<(Lesson & { id: string}) | null>(null);


    const getStatusVariant = (status: Lesson['status']) => {
        switch (status) {
            case 'Confirmed': return 'default';
            case 'Cancelled': return 'destructive';
            case 'Pending': return 'secondary';
            default: return 'outline';
        }
    }
    
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
        <>
            <Card className={lesson.status === 'Cancelled' ? 'opacity-60' : ''}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{lesson.userName}</CardTitle>
                            <CardDescription>{lesson.type} Lesson</CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(lesson.status)}>{lesson.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{format(new Date(`${lesson.date}T${lesson.time}`), 'p')}</span>
                    </div>
                    {instructor && (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            <span>Instructor: {instructor.name}</span>
                        </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Horse: {horse ? horse.name : (lesson.horseId ? 'Not Found' : 'Not Assigned')}</span>
                    </div>
                    {lesson.status !== 'Cancelled' && (
                        <div className="flex justify-end gap-2 pt-2">
                             <Button variant="outline" size="sm" onClick={() => setLessonToEdit(lesson)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {lesson.horseId ? 'Change Horse' : 'Assign Horse'}
                             </Button>
                             <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => setLessonToCancel(lesson)}
                                disabled={!isCancelable(lesson)}
                                title={!isCancelable(lesson) ? "Cannot cancel within 24 hours" : "Cancel Lesson"}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
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
             {lessonToEdit && (
                <SelectHorseDialog 
                    lesson={lessonToEdit}
                    isOpen={!!lessonToEdit}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setLessonToEdit(null)
                        }
                    }}
                />
            )}
        </>
    )
}
