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
        Title <span className="text-red-500">*</span>
      </label>
      <input
        {...register("title")}
        id="title"
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter product title"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
