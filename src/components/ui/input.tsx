import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-xl border border-white/[0.08] bg-[#0d1320] px-3 py-2 text-sm text-white/90 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/25 focus-visible:outline-none focus-visible:border-[#0D9488]/40 focus-visible:ring-2 focus-visible:ring-[#0D9488]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
