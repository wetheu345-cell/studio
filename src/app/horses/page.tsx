import { horses } from "@/lib/data"
import { HorseCard } from "@/components/horse-card"
import { PageHeader } from "@/components/page-header"

export default function HorsesPage() {
  return (
    <div className="container py-12 md:py-16">
      <PageHeader
        title="Meet Our Gentle Giants"
        description="Our 16 horses are the heart of our program. Each has a unique personality and is trained to work with riders of all abilities."
      />
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {horses.map((horse) => (
          <HorseCard key={horse.id} horse={horse} />
        ))}
      </div>
    </div>
  )
}
