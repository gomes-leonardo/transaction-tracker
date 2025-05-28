import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base
          "w-full h-10 px-4 py-2 text-sm rounded-md border transition-all duration-200",

          // Cores normais
          "bg-white/50 border-[#005F61]/20 text-slate-900",
          "placeholder:text-slate-500/60",

          // Focus - estilo personalizado
          "focus:outline-none focus:ring-2 focus:ring-[#005F61]/20 focus:border-[#005F61]",

          // Hover
          "hover:border-[#005F61]/40",

          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          "disabled:bg-slate-100 disabled:border-slate-200",

          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
export { Input }
