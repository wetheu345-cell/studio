
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { Instructor } from '@/lib/types';
import { useEffect } from 'react';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  bio: z.string().min(1, 'Bio is required'),
  imageFile: z.any().optional(),
});

type InstructorFormData = z.infer<typeof FormSchema>;

interface InstructorFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  instructor?: Instructor;
}

export function InstructorFormDialog({
  isOpen,
  onOpenChange,
  instructor,
}: InstructorFormDialogProps) {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      specialty: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (instructor) {
      form.reset({
        name: instructor.name,
        specialty: instructor.specialty,
        bio: instructor.bio,
      });
    } else {
      form.reset({
        name: '',
        specialty: '',
        bio: '',
      });
    }
  }, [instructor, form]);

  const onSubmit = async (data: InstructorFormData) => {
    if (!firestore) return;

    let imageUrl = instructor?.imageUrl || '';
    let imageHint = instructor?.imageHint || 'person';

    try {
        if (data.imageFile && data.imageFile.length > 0) {
            const file = data.imageFile[0];
            const storageRef = ref(storage, `instructors/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
            imageHint = 'custom upload'; 
        }

        const instructorData = {
            name: data.name,
            specialty: data.specialty,
            bio: data.bio,
            imageUrl,
            imageHint,
        };

        if (instructor) {
            const instructorRef = doc(firestore, 'instructors', instructor.id);
            updateDoc(instructorRef, instructorData)
                .then(() => {
                toast({ title: 'Success', description: 'Instructor updated successfully.' });
                })
                .catch(error => {
                errorEmitter.emit(
                    'permission-error',
                    new FirestorePermissionError({
                    path: instructorRef.path,
                    operation: 'update',
                    requestResourceData: instructorData
                    })
                );
                });
        } else {
            const collectionRef = collection(firestore, 'instructors');
            addDoc(collectionRef, instructorData)
                .then(() => {
                toast({ title: 'Success', description: 'Instructor added successfully.' });
                })
                .catch(error => {
                errorEmitter.emit(
                    'permission-error',
                    new FirestorePermissionError({
                    path: collectionRef.path,
                    operation: 'create',
                    requestResourceData: instructorData
                    })
                );
                });
        }

        onOpenChange(false);
        form.reset();
    } catch(e: any) {
        toast({ variant: 'destructive', title: 'Upload Failed', description: e.message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{instructor ? 'Edit Instructor' : 'Add New Instructor'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Beginner & Youth Lessons" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief bio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
  
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
