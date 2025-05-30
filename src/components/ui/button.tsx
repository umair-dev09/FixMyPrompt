
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[hsl(var(--pg-from))] via-[hsl(var(--pg-via))] to-[hsl(var(--pg-to))] text-primary-foreground shadow-sm hover:brightness-110 active:brightness-95 transform hover:scale-[1.03] active:scale-[0.97]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transform hover:scale-[1.03] active:scale-[0.97]",
        outline:
          "border border-border bg-background hover:bg-gradient-to-r hover:from-[hsl(var(--ag-from))] hover:to-[hsl(var(--ag-to))] hover:text-accent-foreground hover:border-transparent active:bg-gradient-to-r active:from-[hsl(var(--ag-from))] active:to-[hsl(var(--ag-to))] active:opacity-90 active:border-transparent transform hover:scale-[1.03] active:scale-[0.97]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transform hover:scale-[1.03] active:scale-[0.97]",
        ghost: "hover:bg-gradient-to-r hover:from-[hsl(var(--ag-from))] hover:to-[hsl(var(--ag-to))] hover:text-accent-foreground active:bg-gradient-to-r active:from-[hsl(var(--ag-from))] active:to-[hsl(var(--ag-to))] active:opacity-90 transform hover:scale-[1.03] active:scale-[0.97]",
        link: "text-[hsl(var(--pg-from))] underline-offset-4 hover:underline hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
