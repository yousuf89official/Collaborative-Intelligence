import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0D9488]/10 text-[#14B8A6] hover:bg-[#0D9488]/20",
        secondary:
          "border-transparent bg-[#4F46E5]/10 text-[#818CF8] hover:bg-[#4F46E5]/20",
        destructive:
          "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline: "text-white/60 border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
