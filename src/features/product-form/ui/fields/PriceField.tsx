"use client"

import type {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"

import type { ProductFormData } from "../../model/types"

type PriceFieldProps = {
  register: UseFormRegister<ProductFormData>
  setValue: UseFormSetValue<ProductFormData>
  error?: FieldError
}

export function PriceField({ register, setValue, error }: PriceFieldProps) {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      // Format to 2 decimal places
      const formatted = parseFloat(value.toFixed(2))
      setValue("price", formatted)
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor="price" className="block text-sm font-medium">
        Price ($) <span className="text-red-500">*</span>
      </label>
      <input
        {...register("price", { valueAsNumber: true })}
        id="price"
        type="number"
        step="0.01"
        onBlur={handleBlur}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0.00"
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
