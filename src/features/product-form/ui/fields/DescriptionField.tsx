import type { FieldError, UseFormRegister } from "react-hook-form"

import type { ProductFormData } from "../../model/types"

type DescriptionFieldProps = {
  register: UseFormRegister<ProductFormData>
  error?: FieldError
}

export function DescriptionField({ register, error }: DescriptionFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="description" className="block text-sm font-medium">
        Description <span className="text-destructive">*</span>
      </label>
      <textarea
        {...register("description")}
        id="description"
        rows={4}
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Enter product description"
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
