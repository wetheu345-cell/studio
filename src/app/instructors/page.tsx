'use client';
import { InstructorCard } from "@/components/instructor-card"
import { PageHeader } from "@/components/page-header"
import { useCollection } from "@/firebase";
import { Instructor } from "@/lib/types";
import { collection, getFirestore } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorsPage() {
    const { data: instructors, loading } = useCollection<Instructor>(collection(getFirestore(), 'instructors'));

  return (
    <div className="container py-12 md:py-16">
      <PageHeader
        title="Our Expert Instructors"
        description="Learn from the best. Our instructors are passionate, experienced, and dedicated to your success and well-being."
      />
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-square" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        ))}
        {instructors?.map((instructor) => (
          <InstructorCard key={instructor.id} instructor={instructor} />
        ))}
      </div>
    </div>
  )
}
