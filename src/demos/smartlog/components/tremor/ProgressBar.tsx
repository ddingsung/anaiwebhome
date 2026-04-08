// Tremor ProgressBar [v0.0.3] — adapted for SmartLog dark theme (always-dark, no dark: prefix)
import React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cx } from "@sl/lib/utils"

const progressBarVariants = tv({
  slots: {
    background: "",
    bar: "",
  },
  variants: {
    variant: {
      success: { background: "bg-emerald-500/20", bar: "bg-emerald-500" },
      warning: { background: "bg-amber-500/20",   bar: "bg-amber-500"   },
      error:   { background: "bg-red-500/20",     bar: "bg-red-500"     },
      neutral: { background: "bg-white/5",        bar: "bg-white/25"    },
    },
  },
  defaultVariants: { variant: "success" },
})

interface ProgressBarProps
  extends React.HTMLProps<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  value?: number
  max?: number
  showAnimation?: boolean
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value = 0, max = 100, showAnimation = false, variant, className, ...props }, forwardedRef) => {
    const safeValue = Math.min(max, Math.max(value, 0))
    const { background, bar } = progressBarVariants({ variant })

    return (
      <div
        ref={forwardedRef}
        className={cx(
          "relative flex h-1.5 w-full items-center rounded-full overflow-hidden",
          background(),
          className,
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        tremor-id="tremor-raw"
        {...props}
      >
        <div
          className={cx(
            "h-full rounded-full",
            bar(),
            showAnimation && "transform-gpu transition-all duration-500 ease-in-out",
          )}
          style={{ width: max ? `${(safeValue / max) * 100}%` : `${safeValue}%` }}
        />
      </div>
    )
  },
)

ProgressBar.displayName = "ProgressBar"
export { ProgressBar, progressBarVariants, type ProgressBarProps }
