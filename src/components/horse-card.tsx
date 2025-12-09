import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Horse } from "@/lib/types"

interface HorseCardProps {
  horse: Pick<Horse, "id" | "name" | "breed" | "imageUrl" | "imageHint">
}

export function HorseCard({ horse }: HorseCardProps) {
  return (
    <Link href={`/horses/${horse.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={horse.imageUrl}
            alt={horse.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint={horse.imageHint}
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-xl font-semibold">{horse.name}</h3>
            <p className="text-muted-foreground">{horse.breed}</p>
          </div>
          <Button variant="link" className="p-0 h-auto justify-start mt-2">
            View Profile &rarr;
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
