'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const steps = [
  { id: '01', name: 'Lesson Type', href: '/booking' },
  { id: '02', name: 'Details', href: '/booking/details' },
  { id: '03', name: 'Schedule', href: '/booking/schedule' },
  { id: '04', name: 'Confirm', href: '/booking/confirm' },
]

export function BookingStepper() {
  const pathname = usePathname()

  const currentStepIndex = steps.findIndex(step => pathname.startsWith(step.href));

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('relative', stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : '')}>
            {stepIdx < currentStepIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-accent" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent hover:bg-accent/90"
                >
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : stepIdx === currentStepIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent bg-white"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
             <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-center font-medium text-gray-500 whitespace-nowrap">{step.name}</p>
          </li>
        ))}
      </ol>
    </nav>
  )
}
