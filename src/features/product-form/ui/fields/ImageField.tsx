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
        Image URL <span className="text-red-500">*</span>
      </label>
      <input
        {...register("image")}
        id="image"
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="https://example.com/image.jpg"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
