import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@crm/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-indigo-50 text-indigo-700 border-indigo-200",
        secondary: "bg-gray-100 text-gray-600 border-gray-200",
        destructive: "bg-red-50 text-red-600 border-red-200",
        warning: "bg-amber-50 text-amber-600 border-amber-200",
        success: "bg-emerald-50 text-emerald-600 border-emerald-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
))
Badge.displayName = "Badge"

export { Badge, badgeVariants }
