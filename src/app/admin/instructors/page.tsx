
'use client';
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCollection, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { Instructor } from "@/lib/types";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { InstructorFormDialog } from './_components/instructor-form-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminInstructorsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const instructorsCollection = useMemo(() => firestore ? collection(firestore, 'instructors') : null, [firestore]);
  const { data: instructors, isLoading } = useCollection<Instructor>(instructorsCollection);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | undefined>(undefined);

  const handleAddInstructor = () => {
    setSelectedInstructor(undefined);
    setIsDialogOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsDialogOpen(true);
  }

  const handleDeleteInstructor = (instructorId: string) => {
    if (!firestore) return;
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      const instructorRef = doc(firestore, 'instructors', instructorId);
      deleteDoc(instructorRef)
        .then(() => {
          toast({ title: 'Success', description: 'Instructor deleted successfully.' });
        })
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: instructorRef.path,
              operation: 'delete'
            })
          );
        });
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Instructors" className="text-left" />
        <Button onClick={handleAddInstructor}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Instructor
        </Button>
      </div>
      <Card className="mt-8">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Specialty</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>...</AvatarFallback>
                      </Avatar>
                      Loading...
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">Loading...</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
              {instructors?.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {instructor.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{instructor.specialty}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditInstructor(instructor)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteInstructor(instructor.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <InstructorFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        instructor={selectedInstructor}
      />
    </div>
  )
}
