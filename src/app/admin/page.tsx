
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Calendar, Heart, Users, DollarSign } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Lesson, Horse, Instructor } from "@/lib/types";
import { collection } from "firebase/firestore";

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const lessonsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'lessons') : null, [firestore]);
  const horsesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'horses') : null, [firestore]);
  const instructorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'instructors') : null, [firestore]);

  const { data: lessons, loading: lessonsLoading } = useCollection<Lesson>(lessonsCollection);
  const { data: horses, loading: horsesLoading } = useCollection<Horse>(horsesCollection);
  const { data: instructors, loading: instructorsLoading } = useCollection<Instructor>(instructorsCollection);

  const stats = [
    { title: "Total Bookings", value: lessonsLoading ? '...' : lessons?.length, icon: Calendar, color: "text-blue-500" },
    { title: "Revenue (Today)", value: "$450", icon: DollarSign, color: "text-green-500" },
    { title: "Available Horses", value: horsesLoading ? '...' : horses?.length, icon: Heart, color: "text-orange-500" },
    { title: "Active Instructors", value: instructorsLoading ? '...' : instructors?.length, icon: Users, color: "text-purple-500" },
  ]

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
      
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}
