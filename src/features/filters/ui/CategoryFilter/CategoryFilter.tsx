"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { MultiSelect } from "@/shared/ui"

import { selectCategories, setCategories } from "../../model"

type CategoryFilterProps = {
  /** Available categories from products */
  categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const dispatch = useAppDispatch()
  const selectedCategories = useAppSelector(selectCategories)

  const handleChange = (selected: string[]) => {
    dispatch(setCategories(selected))
  }

  const options = categories.map((category) => ({
    value: category,
    label: category,
  }))

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Categories:</span>
      <MultiSelect
        value={selectedCategories}
        onChange={handleChange}
        options={options}
        className="w-48"
      />
    </div>
  )
}
