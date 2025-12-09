
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 text-center", className)}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
        {title}
      </h1>
      {description && (
        <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
