import { instructors } from "@/lib/data"
import { InstructorCard } from "@/components/instructor-card"
import { PageHeader } from "@/components/page-header"

export default function InstructorsPage() {
  return (
    <div className="container py-12 md:py-16">
      <PageHeader
        title="Our Expert Instructors"
        description="Learn from the best. Our instructors are passionate, experienced, and dedicated to your success and well-being."
      />
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {instructors.map((instructor) => (
          <InstructorCard key={instructor.id} instructor={instructor} />
        ))}
      </div>
    </div>
  )
}
