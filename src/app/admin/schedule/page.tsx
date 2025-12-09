
'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Lesson } from "@/lib/types";
import { collection } from "firebase/firestore";

export default function AdminSchedulePage() {
  const firestore = useFirestore();
  const lessonsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'lessons') : null, [firestore]);
  const { data: lessons, isLoading } = useCollection<Lesson>(lessonsCollection);

  return (
    <div className="p-4 md:p-8 grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="flex items-center justify-between">
            <PageHeader title="Full Schedule" className="text-left" />
            <div className="flex items-center gap-2">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Instructors" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Instructors</SelectItem>
                        <SelectItem value="jane-doe">Jane Doe</SelectItem>
                        <SelectItem value="john-smith">John Smith</SelectItem>
                    </SelectContent>
                </Select>
                 <Button variant="outline">Today</Button>
                 <Button variant="outline">Month</Button>
            </div>
        </div>
        <Card className="mt-8">
            <CardContent className="pt-6">
                <Calendar
                    mode="single"
                    selected={new Date()}
                    className="p-0"
                    classNames={{
                        day: "h-16 w-full text-lg",
                        head_cell: "w-full",
                    }}
                />
            </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <PageHeader title="Upcoming" className="text-left" />
        <div className="mt-8 space-y-4">
            {isLoading && <p>Loading...</p>}
            {lessons?.map(lesson => (
                <Card key={lesson.id} className="p-4 flex items-center justify-between">
                    <div>
                        <p className="font-bold">{lesson.userName}</p>
                        <p className="text-sm text-muted-foreground">{lesson.time} - {lesson.type} Lesson</p>
                    </div>
                    <Badge variant={lesson.status === 'Confirmed' ? 'default' : 'secondary'}>{lesson.status}</Badge>
                </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
