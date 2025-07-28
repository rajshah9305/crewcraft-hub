import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-glow hover:scale-[1.02] border border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/40 hover:shadow-glow",
        secondary:
          "bg-gradient-secondary text-secondary-foreground hover:bg-secondary/80 shadow-card hover:shadow-lg border border-secondary/30",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground hover:shadow-accent/20 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        hero: "bg-gradient-primary text-white hover:scale-105 shadow-glow hover:shadow-interactive font-semibold border border-primary/30 animate-pulse-glow",
        gradient: "bg-gradient-accent text-white hover:opacity-90 shadow-accent hover:shadow-interactive hover:scale-[1.02]",
        premium: "bg-gradient-glow text-white shadow-interactive hover:shadow-glow hover:scale-105 border border-accent/50 font-semibold",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-lg hover:shadow-xl",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg font-semibold",
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
