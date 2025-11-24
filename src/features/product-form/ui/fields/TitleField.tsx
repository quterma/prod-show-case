import type { FieldError, UseFormRegister } from "react-hook-form"

import type { ProductFormData } from "../../model/types"

type TitleFieldProps = {
  register: UseFormRegister<ProductFormData>
  error?: FieldError
}

export function TitleField({ register, error }: TitleFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="title" className="block text-sm font-medium">
        Title <span className="text-destructive">*</span>
      </label>
      <input
        {...register("title")}
        id="title"
        type="text"
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Enter product title"
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
