import { useState } from "react"
import { type FieldError, type FieldErrors } from "react-hook-form"

/**
 * Hook for handling form submission with loading states and error handling
 * Designed to work seamlessly with RTK Query mutations
 */
export function useFormSubmission<TData, TError = unknown>(
  onSubmit: (data: TData) => Promise<unknown> | unknown,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: TError) => void
  }
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (data: TData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      await onSubmit(data)

      options?.onSuccess?.(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred"
      setSubmitError(errorMessage)
      options?.onError?.(error as TError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    clearError: () => setSubmitError(null),
  }
}

// Re-export commonly used react-hook-form utilities
export { type FieldError, type FieldErrors }
