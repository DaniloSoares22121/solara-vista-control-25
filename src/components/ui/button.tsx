
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5 shadow-lg hover:shadow-xl relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 text-white shadow-emerald-200/50 hover:shadow-emerald-300/60 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 border border-emerald-400/20",
        destructive:
          "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-red-200/50 hover:shadow-red-300/60 hover:from-red-600 hover:via-red-700 hover:to-red-800 border border-red-400/20",
        outline:
          "border-2 border-emerald-200/50 bg-white/80 backdrop-blur-sm hover:bg-emerald-50/80 hover:text-emerald-700 text-emerald-600 shadow-sm hover:shadow-lg hover:border-emerald-300/60",
        secondary:
          "bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 text-slate-700 shadow-slate-200/50 hover:shadow-slate-300/60 hover:from-slate-200 hover:via-slate-300 hover:to-slate-200 border border-slate-300/20",
        ghost: "hover:bg-emerald-50/80 hover:text-emerald-700 text-emerald-600 shadow-none hover:shadow-md backdrop-blur-sm",
        link: "text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700 shadow-none",
      },
      size: {
        default: "h-12 px-8 py-3 text-sm",
        sm: "h-10 rounded-xl px-6 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        <div className="relative z-10 flex items-center justify-center gap-2">
          {props.children}
        </div>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
