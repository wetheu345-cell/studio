import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { ArrowRight } from 'lucide-react'

export default function BookingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const type = searchParams?.type

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        title="Choose Your Experience"
        description="Select the type of lesson you're interested in. Both options offer a unique connection with our amazing horses."
      />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/booking/details?type=Regular">
          <Card className={`hover:border-accent cursor-pointer transition-all duration-300 ${type === 'Regular' ? 'border-accent border-2' : ''}`}>
            <CardHeader className="flex-row items-center gap-4">
              <div>
                <CardTitle className="font-headline text-2xl tracking-wide">Regular Lesson</CardTitle>
                <CardDescription>Focus on skill, horsemanship, and fun. For all levels.</CardDescription>
              </div>
              <ArrowRight className="h-8 w-8 text-muted-foreground ml-auto" />
            </CardHeader>
          </Card>
        </Link>
        <Link href="/booking/details?type=Therapy">
          <Card className={`hover:border-accent cursor-pointer transition-all duration-300 ${type === 'Therapy' ? 'border-accent border-2' : ''}`}>
            <CardHeader className="flex-row items-center gap-4">
              <div>
                <CardTitle className="font-headline text-2xl tracking-wide">Therapy Session</CardTitle>
                <CardDescription>A guided session for emotional growth and well-being.</CardDescription>
              </div>
              <ArrowRight className="h-8 w-8 text-muted-foreground ml-auto" />
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
