// Tremor Card [v1.0.0] — adapted for SmartLog dark theme
import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cx } from "@sl/lib/utils"

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, style, ...props }, forwardedRef) => {
    const Component = asChild ? Slot : "div"
    return (
      <Component
        ref={forwardedRef}
        className={cx("relative w-full rounded-lg border text-left", className)}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          ...style,
        }}
        tremor-id="tremor-raw"
        {...props}
      />
    )
  },
)

Card.displayName = "Card"
export { Card, type CardProps }
