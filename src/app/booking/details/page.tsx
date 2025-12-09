
'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useCollection, useFirestore } from '@/firebase'
import { collection } from 'firebase/firestore'
import type { Horse, Instructor } from '@/lib/types'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function BookingDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const firestore = useFirestore()

  const lessonType = searchParams.get('type') || 'Regular'
  const horseIdParam = searchParams.get('horseId')
  const instructorIdParam = searchParams.get('instructorId')

  const [selectedHorseId, setSelectedHorseId] = useState<string | undefined>(horseIdParam)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | undefined>(instructorIdParam)

  const horsesCollection = useMemo(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  const instructorsCollection = useMemo(() => firestore ? collection(firestore, 'instructors') : null, [firestore]);

  const { data: horses, isLoading: horsesLoading } = useCollection<Horse>(horsesCollection);
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);


  const handleNext = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedHorseId) params.set('horseId', selectedHorseId)
    if (selectedInstructorId) params.set('instructorId', selectedInstructorId)
    router.push(`/booking/schedule?${params.toString()}`)
  }

  const availableHorses = useMemo(() => {
    if (!horses) return []
    if (lessonType === 'Therapy') {
      return horses.filter(h => h.suitability === 'Therapy')
    }
    return horses
  }, [horses, lessonType])

  const loading = horsesLoading || instructorsLoading;

  return (
    <div className="container py-12">
      <PageHeader
        title="Customize Your Lesson"
        description="Choose your companion and guide for this unique experience."
      />

      <div className="mt-12 w-full max-w-6xl mx-auto space-y-12">
        {/* Horse Selection */}
        <div>
          <h2 className="text-2xl font-headline mb-4">Select a Horse</h2>
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <div className="relative aspect-w-1 aspect-h-1 w-full h-48">
                   <Image src={horse.imageUrl} alt={horse.name} fill className="object-cover" />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold">{horse.name}</h3>
                  <p className="text-sm text-muted-foreground">{horse.breed}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>

        {/* Instructor Selection */}
        <div>
          <h2 className="text-2xl font-headline mb-4">Select an Instructor</h2>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {instructors?.map((instructor) => (
                <Card
                    key={instructor.id}
                    onClick={() => setSelectedInstructorId(instructor.id)}
                    className={cn(
                    'cursor-pointer transition-all relative overflow-hidden',
                    selectedInstructorId === instructor.id && 'border-accent border-2'
                    )}
                >
                     {selectedInstructorId === instructor.id && (
                        <div className="absolute top-2 right-2 bg-accent rounded-full p-1 z-10">
                            <CheckCircle className="h-5 w-5 text-accent-foreground" />
                        </div>
                    )}
                    <div className="relative aspect-w-1 aspect-h-1 w-full h-48">
                        <Image src={instructor.imageUrl} alt={instructor.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-3">
                    <h3 className="font-semibold">{instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{instructor.specialty}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
            )}
        </div>
      </div>

      <div className="mt-12 w-full max-w-6xl mx-auto flex justify-end">
        <Button size="lg" onClick={handleNext} disabled={!selectedHorseId || !selectedInstructorId}>
          Next: Schedule <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
