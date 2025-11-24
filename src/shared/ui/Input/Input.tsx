import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Label text displayed above the input */
  label?: string
  /** Error message displayed below the input */
  error?: string
  /** Helper text displayed below the input (if no error) */
  helperText?: string
  /** Icon displayed inside the input on the left */
  iconLeft?: ReactNode
  /** Icon displayed inside the input on the right */
  iconRight?: ReactNode
  /** Whether the input should take full width */
  fullWidth?: boolean
  /** Custom class for the container */
  containerClassName?: string
}

/**
 * Input component with support for labels, errors, icons, and semantic tokens.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      fullWidth = true,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          fullWidth ? "w-full" : "w-auto",
          containerClassName
        )}
      >
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconLeft}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              iconLeft && "pl-10",
              iconRight && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
