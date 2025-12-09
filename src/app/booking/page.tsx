import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { ArrowRight, FileText } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function BookingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const type = searchParams?.type
  const registrationFormUrl = "https://static1.squarespace.com/static/60f9964e5087f364fd204293/t/614383141a64b1606d163ee6/1631814421172/2021+Public+Riding+Lesson+Registration.pdf"

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        title="Choose Your Experience"
        description="Select the type of lesson you're interested in. Both options offer a unique connection with our amazing horses."
      />
      <div className="mt-12 w-full max-w-4xl space-y-8">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>New Riders!</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p>A registration form is required for all new riders. Please download, complete, and bring it with you to your first lesson.</p>
            <Button asChild variant="outline" className="mt-2 sm:mt-0">
              <a href={registrationFormUrl} target="_blank" rel="noopener noreferrer">
                Download Form
              </a>
            </Button>
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  )
}
