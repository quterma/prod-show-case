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
        Review Count <span className="text-red-500">*</span>
      </label>
      <input
        {...register("count", { valueAsNumber: true })}
        id="count"
        type="number"
        min="0"
        step="1"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
