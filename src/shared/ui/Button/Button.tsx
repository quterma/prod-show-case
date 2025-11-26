import type { ButtonHTMLAttributes, ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
type ButtonSize = "sm" | "md" | "lg" | "icon"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring",
  outline:
    "bg-background dark:bg-secondary/10 text-foreground border border-input hover:bg-accent hover:text-accent-foreground focus:ring-ring",
  ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-ring",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  icon: "h-9 w-9 p-0",
}

export function Button({
  variant = "outline",
  size = "md",
  className = "",
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium rounded-md flex items-center justify-center cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
