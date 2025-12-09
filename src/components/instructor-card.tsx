import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Instructor } from "@/lib/types"

interface InstructorCardProps {
  instructor: Instructor
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Link href={`/instructors/${instructor.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative w-full aspect-square">
          <Image
            src={instructor.imageUrl}
            alt={instructor.name}
            fill
            className="object-cover"
            data-ai-hint={instructor.imageHint}
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-xl font-semibold tracking-wide">{instructor.name}</h3>
            <p className="text-muted-foreground">{instructor.specialty}</p>
          </div>
          <Button variant="link" className="p-0 h-auto justify-start mt-2">
            View Profile &rarr;
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
