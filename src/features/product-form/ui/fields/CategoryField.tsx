"use client"

import { useState } from "react"
import type {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"

import type { ProductFormData } from "../../model/types"

const ADD_NEW_VALUE = "__ADD_NEW__"

type CategoryFieldProps = {
  register: UseFormRegister<ProductFormData>
  setValue: UseFormSetValue<ProductFormData>
  error?: FieldError
  availableCategories: string[]
  defaultValue?: string
}

export function CategoryField({
  register,
  setValue,
  error,
  availableCategories,
  defaultValue,
}: CategoryFieldProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (value === ADD_NEW_VALUE) {
      setIsAddingNew(true)
      setValue("category", "")
    } else {
      setIsAddingNew(false)
      setValue("category", value)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("category", e.target.value)
  }

  return (
    <div className="space-y-1">
      <label htmlFor="category" className="block text-sm font-medium">
        Category <span className="text-red-500">*</span>
      </label>

      {isAddingNew ? (
        <div className="space-y-2">
          <input
            {...register("category")}
            id="category"
            type="text"
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new category name"
            autoFocus
          />
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(false)
              setValue("category", defaultValue || "")
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to list
          </button>
        </div>
      ) : (
        <select
          {...register("category")}
          id="category"
          onChange={handleSelectChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value={ADD_NEW_VALUE} className="font-semibold">
            + Add new category
          </option>
        </select>
      )}

      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
