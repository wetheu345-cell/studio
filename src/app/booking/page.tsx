
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { ArrowRight, FileText, DollarSign, Users, Calendar, Building } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function BookingPage({ searchParams }: PageProps) {
  const type = searchParams?.type
  const registrationFormUrl = "https://static1.squarespace.com/static/60f9964e5087f364fd204293/t/614383141a64b1606d163ee6/1631814421172/2021+Public+Riding+Lesson+Registration.pdf"

  return (
    <div className="flex flex-col items-center">
      <PageHeader
        title="Choose Your Experience"
        description="Select the type of service you're interested in. All our options offer a unique connection with our amazing horses and history."
      />
      <div className="mt-12 w-full max-w-6xl space-y-8">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>New Riders!</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p>A registration form is required for all new riders. Please download, complete, and bring it with you to your first lesson.</p>
            <Button asChild variant="outline" className="mt-2 sm:mt-0 shrink-0">
              <a href={registrationFormUrl} target="_blank" rel="noopener noreferrer">
                Download Form
              </a>
            </Button>
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <Link href="/booking/details?type=Regular" className="flex">
            <Card className={`w-full hover:border-accent cursor-pointer transition-all duration-300 flex flex-col ${type === 'Regular' ? 'border-accent border-2' : ''}`}>
              <CardHeader>
                  <CardTitle className="font-headline text-2xl tracking-wide">Regular Lesson</CardTitle>
                  <CardDescription>Ride, relax, and connect with nature. Individual and group lessons, English or Western saddles, are customized for your age (5+) and experience level.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-accent" /> Cost: $60/lesson or a package of 5 for $250</li>
                    <li className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Ages: 5 and up</li>
                    <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Schedule: By appointment only</li>
                </ul>
                <div className="text-center mt-auto">
                    <Button variant="link" className="w-full">
                        Book a Regular Lesson
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/booking/details?type=Therapy" className="flex">
            <Card className={`w-full hover:border-accent cursor-pointer transition-all duration-300 flex flex-col ${type === 'Therapy' ? 'border-accent border-2' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-wide">Therapy Session</CardTitle>
                <CardDescription>Riding for therapy is an equine-assisted activity that improves balance, strength, and coordination, as well as providing stress relief and enhancing cognitive and social skills.</CardDescription>
              </CardHeader>
               <CardContent className="flex-grow flex flex-col justify-end">
                 <div className="text-center mt-auto">
                    <Button variant="link" className="w-full">
                        Book a Therapy Session
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/booking/rental" className="flex">
            <Card className={`w-full hover:border-accent cursor-pointer transition-all duration-300 flex flex-col ${type === 'MuseumRental' ? 'border-accent border-2' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-wide">Museum Rental</CardTitle>
                <CardDescription>Host your event at our unique and historic on-site museum. Perfect for parties, meetings, and gatherings.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                 <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    <li className="flex items-center gap-2"><Building className="h-4 w-4 text-accent" /> Capacity for up to 50 guests</li>
                    <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Available for weekend and evening bookings</li>
                </ul>
                 <div className="text-center mt-auto">
                    <Button variant="link" className="w-full">
                        Book The Museum
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-semibold">Payment Methods:</p>
                <p className="text-muted-foreground">We accept Cash, Check, Debit/Credit Card, or PayPal. Payment must be made before the lesson to confirm your booking.</p>
                <p className="font-semibold mt-4">Facilities:</p>
                <p className="text-muted-foreground">Lessons are conducted in our large outdoor show and warm-up rings, or in our heated 6,000 sq. ft. indoor riding arena.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
