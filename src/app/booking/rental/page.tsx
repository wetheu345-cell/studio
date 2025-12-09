
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const rentalSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().min(1, 'A time is required'),
  guests: z.coerce.number().min(1, 'At least one guest is required').max(50, 'Maximum 50 guests'),
  notes: z.string().optional(),
})

type RentalFormData = z.infer<typeof rentalSchema>

export default function MuseumRentalPage() {
  const router = useRouter()
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
  });
  const watchedDate = watch("date");

  const onSubmit: SubmitHandler<RentalFormData> = (data) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to book a rental.' })
      return
    }

    const rentalData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      email: user.email,
      status: 'Pending' as const,
    };

    const collectionRef = collection(firestore, 'museumRentals');
    addDoc(collectionRef, rentalData)
      .then(() => {
        toast({ title: 'Rental Request Sent!', description: "We've received your request and will be in touch shortly to confirm." })
        router.push('/')
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: rentalData,
        }));
      });
  }

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        title="Book the Museum"
        description="Host your next event in our unique and historic setting. Fill out the form below to request a date."
      />
      <Card className="w-full max-w-2xl mt-12">
        <CardHeader>
          <CardTitle>Rental Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedDate ? format(watchedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedDate}
                      onSelect={(day) => control.setValue('date', day || new Date())}
                      initialFocus
                      disabled={(day) => day < new Date(new Date().toDateString())}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <Label htmlFor="time">Event Time</Label>
                <Input id="time" type="time" {...register('time')} />
                {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="guests">Number of Guests (Max 50)</Label>
              <Input id="guests" type="number" {...register('guests')} />
              {errors.guests && <p className="text-sm text-destructive mt-1">{errors.guests.message}</p>}
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any special requests or details about your event?" {...register('notes')} />
              {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isUserLoading}>
              {isUserLoading ? 'Loading...' : 'Submit Request'}
            </Button>
             {!user && !isUserLoading && (
                <p className="text-center text-sm text-muted-foreground">
                    Please <a href="/login" className="underline">log in</a> or <a href="/signup" className="underline">sign up</a> to submit a request.
                </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
