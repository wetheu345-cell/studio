
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Calendar, Heart, Users, DollarSign, Video, MessageSquare, Building } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Lesson, Horse, Instructor } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const lessonsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'lessons') : null, [firestore]);
  const horsesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  const instructorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'instructors') : null, [firestore]);

  const { data: lessons, isLoading: lessonsLoading } = useCollection<Lesson>(lessonsCollection);
  const { data: horses, isLoading: horsesLoading } = useCollection<Horse>(horsesCollection);
  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);

  const stats = [
    { title: "Total Bookings", value: lessonsLoading ? '...' : lessons?.length, icon: Calendar, color: "text-blue-500" },
    { title: "Revenue (Today)", value: "$450", icon: DollarSign, color: "text-green-500" },
    { title: "Available Horses", value: horsesLoading ? '...' : horses?.length, icon: Heart, color: "text-orange-500" },
    { title: "Active Instructors", value: instructorsLoading ? '...' : instructors?.length, icon: Users, color: "text-purple-500" },
  ]

  const zoomMeetingLink = "https://zoom.us/j/1234567890" // Replace with your actual meeting link

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="Admin Dashboard" description="Welcome back! Here's a summary of your operations." className="text-left" />

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>An overview of recent bookings and activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <p>Recent activity feed will be displayed here.</p>
                </div>
            </CardContent>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Team Hub</CardTitle>
                    <CardDescription>Tools for instructors and managers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full">
                        <a href={zoomMeetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="mr-2 h-4 w-4"/>
                            Join Weekly Staff Meeting
                        </a>
                    </Button>
                     <Button asChild variant="outline" className="w-full">
                        <Link href="/admin/messaging">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Team Messaging
                        </Link>
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Set your weekly availability from the 'Availability' tab.</p>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Museum Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/admin/rentals">
                            <Building className="mr-2 h-4 w-4" />
                             View Rentals
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

    </div>
  )
}
