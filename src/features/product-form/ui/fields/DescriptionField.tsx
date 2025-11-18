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
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        {...register("description")}
        id="description"
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter product description"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
