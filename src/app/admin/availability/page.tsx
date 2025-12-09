
'use client';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function AvailabilityPage() {

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="My Availability"
        description="Set your available hours for the upcoming week."
        className="text-left"
      />

      <div className="mt-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Week View</CardTitle>
                    <CardDescription>Select a day to manage your time slots.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={new Date()}
                        className="rounded-md border"
                    />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card>
                 <CardHeader>
                    <CardTitle>Manage Time Slots</CardTitle>
                    <CardDescription>Add or remove your working hours for the selected day.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                        <p>Availability time slot selection will be available here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
