import type { FieldError, UseFormRegister } from "react-hook-form"

import type { ProductFormData } from "../../model/types"

type CountFieldProps = {
  register: UseFormRegister<ProductFormData>
  error?: FieldError
}

export function CountField({ register, error }: CountFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="count" className="block text-sm font-medium">
        Count
      </label>
      <input
        {...register("count", { valueAsNumber: true })}
        id="count"
        type="number"
        min="0"
        step="1"
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="0"
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
