import type { FieldError, UseFormRegister } from "react-hook-form"

import type { ProductFormData } from "../../model/types"

type RatingFieldProps = {
  register: UseFormRegister<ProductFormData>
  error?: FieldError
}

export function RatingField({ register, error }: RatingFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="rate" className="block text-sm font-medium">
        Rating (0-5)
      </label>
      <input
        {...register("rate", { valueAsNumber: true })}
        id="rate"
        type="number"
        step="0.1"
        min="0"
        max="5"
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="0.0"
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
