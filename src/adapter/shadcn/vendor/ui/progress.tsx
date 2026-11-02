"use client"

import * as React from "react"
import { useDirection } from "@radix-ui/react-direction"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../lib/utils.js"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const direction = useDirection()
  const offset = (direction === "rtl" ? 1 : -1) * (100 - (value || 0))
  return (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(${offset}%)` }}
    />
  </ProgressPrimitive.Root>
)
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
