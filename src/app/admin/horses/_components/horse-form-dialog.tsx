
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { Horse, HorseFormData } from '@/lib/types';
import { useEffect } from 'react';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.coerce.number().min(0, 'Age must be a positive number'),
  description: z.string().min(1, 'Description is required'),
  suitability: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Therapy']),
  imageFile: z.any().optional(),
});

interface HorseFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  horse?: Horse;
}

export function HorseFormDialog({
  isOpen,
  onOpenChange,
  horse,
}: HorseFormDialogProps) {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const form = useForm<HorseFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      breed: '',
      age: 0,
      description: '',
      suitability: 'Beginner',
    },
  });

  useEffect(() => {
    if (horse) {
      form.reset({
        name: horse.name,
        breed: horse.breed,
        age: horse.age,
        description: horse.description,
        suitability: horse.suitability,
      });
    } else {
      form.reset({
        name: '',
        breed: '',
        age: 0,
        description: '',
        suitability: 'Beginner',
      });
    }
  }, [horse, form]);

  const onSubmit = async (data: HorseFormData) => {
    try {
      let imageUrl = horse?.imageUrl || '';
      let imageHint = horse?.imageHint || 'horse';

      // Handle image upload
      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        const storageRef = ref(storage, `horses/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
        imageHint = 'custom upload'; 
      }

      const horseData = {
        name: data.name,
        breed: data.breed,
        age: data.age,
        description: data.description,
        suitability: data.suitability,
        imageUrl,
        imageHint,
      };

      if (horse) {
        // Update existing horse
        await updateDoc(doc(firestore, 'horses', horse.id), horseData);
        toast({ title: 'Success', description: 'Horse updated successfully.' });
      } else {
        // Add new horse
        await addDoc(collection(firestore, 'horses'), horseData);
        toast({ title: 'Success', description: 'Horse added successfully.' });
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving horse:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save the horse.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{horse ? 'Edit Horse' : 'Add New Horse'}</DialogTitle>
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
                    <Input placeholder="Apollo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Thoroughbred" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suitability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suitability</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select suitability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Therapy">Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description..." {...field} />
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
