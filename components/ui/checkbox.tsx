"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon, DashIcon } from "@radix-ui/react-icons"

import { cn } from "@/components/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-3.5 w-3.5 shrink-0 cursor-pointer rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[disabled=true]:border-0 data-[disabled=true]:!bg-red-500 data-[disabled=true]:!text-white",
      "group/check",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("relative flex items-center justify-center text-current")}
    >
      <DashIcon
        className={cn(
          "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2",
          "opacity-0 group-data-[disabled=true]/check:opacity-100"
        )}
      />
      <CheckIcon
        className={cn(
          "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2",
          "group-data-[disabled=true]/check:opacity-0"
        )}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
