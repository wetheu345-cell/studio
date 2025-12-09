'use client';
import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Lesson, Instructor } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function MySchedulePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedLesson, setSelectedLesson] = useState<(Lesson & { id: string }) | null>(null);

  const instructorsCollection = useMemo(
    () => (firestore && user ? query(collection(firestore, 'instructors'), where('userId', '==', user.uid)) : null),
    [firestore, user]
  );
  const { data: instructors, loading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);
  const instructor = instructors?.[0];

  const lessonsQuery = useMemo(
    () => (firestore && instructor ? query(collection(firestore, 'lessons'), where('instructorId', '==', instructor.id)) : null),
    [firestore, instructor]
  );
  const { data: lessons, loading: lessonsLoading } = useCollection<Lesson>(lessonsQuery);
  
  const loading = instructorsLoading || lessonsLoading;

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="My Schedule" description="View and manage your upcoming lessons." className="text-left" />

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
                <TableRow key={lesson.id}>
                  <TableCell>{lesson.userName}</TableCell>
                  <TableCell>{new Date(lesson.date).toLocaleDateString()} - {lesson.time}</TableCell>
                  <TableCell>{lesson.type}</TableCell>
                  <TableCell>
                    <Badge variant={lesson.status === 'Confirmed' ? 'default' : 'secondary'}>
                      {lesson.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lesson.horseId || 'Not Assigned'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedLesson(lesson)}>
                      {lesson.horseId ? 'Change' : 'Select'} Horse
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
    </div>
  );
}
