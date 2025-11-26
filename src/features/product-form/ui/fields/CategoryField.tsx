"use client"

import { useState } from "react"
import type {
  Control,
  FieldError,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"
import { Controller } from "react-hook-form"

import { Select } from "@/shared/ui"

import type { ProductFormData } from "../../model/types"

const ADD_NEW_VALUE = "__ADD_NEW__"

type CategoryFieldProps = {
  register: UseFormRegister<ProductFormData>
  control: Control<ProductFormData>
  setValue: UseFormSetValue<ProductFormData>
  error?: FieldError
  availableCategories: string[]
  defaultValue?: string
}

export function CategoryField({
  register,
  control,
  setValue,
  error,
  availableCategories,
  defaultValue,
}: CategoryFieldProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)

  // If no categories available, always show input
  const hasCategories = availableCategories.length > 0

  const handleSelectChange = (value: string | number) => {
    if (value === ADD_NEW_VALUE) {
      setIsAddingNew(true)
      setValue("category", "")
    } else {
      setIsAddingNew(false)
      setValue("category", String(value))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("category", e.target.value)
  }

  return (
    <div className="space-y-1">
      <label htmlFor="category" className="block text-sm font-medium">
        Category <span className="text-destructive">*</span>
      </label>

      {!hasCategories || isAddingNew ? (
        <div className="space-y-2">
          <input
            {...register("category")}
            id="category"
            type="text"
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter category name"
            autoFocus={isAddingNew}
          />
          {hasCategories && isAddingNew && (
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false)
                setValue("category", defaultValue || "")
              }}
              className="text-sm text-primary hover:text-primary/80 cursor-pointer"
            >
              ← Back to list
            </button>
          )}
        </div>
      ) : (
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={(val) => {
                field.onChange(val)
                handleSelectChange(val)
              }}
              options={[
                { value: "", label: "Select a category" },
                ...availableCategories.map((cat) => ({
                  value: cat,
                  label: cat,
                })),
                {
                  value: ADD_NEW_VALUE,
                  label: "+ Add new category",
                  className: "font-semibold text-primary",
                },
              ]}
              error={!!error}
            />
          )}
        />
      )}

      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  )
}
