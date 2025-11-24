import type { FieldError, UseFormRegister } from "react-hook-form"

import type { ProductFormData } from "../../model/types"

type ImageFieldProps = {
  register: UseFormRegister<ProductFormData>
  error?: FieldError
}

export function ImageField({ register, error }: ImageFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="image" className="block text-sm font-medium">
        Image URL <span className="text-destructive">*</span>
      </label>
      <input
        {...register("image")}
        id="image"
        type="url"
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="https://example.com/image.jpg"
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
