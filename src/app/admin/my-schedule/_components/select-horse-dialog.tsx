
'use client';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Horse, Lesson } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelectHorseDialogProps {
  lesson: Lesson & { id: string };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SelectHorseDialog({
  lesson,
  isOpen,
  onOpenChange,
}: SelectHorseDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(
    lesson.horseId || null
  );

  const horsesCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'horses') : null),
    [firestore]
  );
  const { data: horses, loading } = useCollection<Horse>(horsesCollection);

  const availableHorses = useMemo(() => {
    if (!horses) return [];
    if (lesson.type === 'Therapy') {
      return horses.filter((h) => h.suitability === 'Therapy');
    }
    return horses;
  }, [horses, lesson.type]);

  const handleSave = async () => {
    if (!selectedHorseId) return;

    const lessonRef = doc(firestore, 'lessons', lesson.id);
    try {
      await updateDoc(lessonRef, {
        horseId: selectedHorseId,
        status: 'Confirmed',
      });
      toast({
        title: 'Horse Assigned!',
        description: 'The horse has been successfully assigned to the lesson.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem assigning the horse.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a Horse for the Lesson</DialogTitle>
          <DialogDescription>
            Choose a suitable horse for {lesson.userName}&apos;s {lesson.type}{' '}
            lesson.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1">
          {loading ? (
            <p>Loading horses...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableHorses.map((horse) => (
                <Card
                  key={horse.id}
                  onClick={() => setSelectedHorseId(horse.id)}
                  className={cn(
                    'cursor-pointer transition-all relative overflow-hidden',
                    selectedHorseId === horse.id && 'border-accent border-2'
                  )}
                >
                  {selectedHorseId === horse.id && (
                    <div className="absolute top-2 right-2 bg-accent rounded-full p-1 z-10">
                      <CheckCircle className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                  <div className="relative aspect-w-1 aspect-h-1 w-full h-32">
                    <Image
                      src={horse.imageUrl}
                      alt={horse.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">
                      {horse.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {horse.breed}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedHorseId}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
