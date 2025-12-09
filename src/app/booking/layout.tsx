import { BookingStepper } from "@/components/booking-stepper";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-12">
      <BookingStepper />
      <div className="mt-8">{children}</div>
    </div>
  )
}
