import { type ReactNode } from "react"

interface FormErrorProps {
  error?: string
  className?: string
}

export function FormError({ error, className = "" }: FormErrorProps) {
  if (!error) return null

  return (
    <div className={`text-sm text-red-600 mt-1 ${className}`} role="alert">
      {error}
    </div>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  required = false,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <FormError error={error} />
    </div>
  )
}
