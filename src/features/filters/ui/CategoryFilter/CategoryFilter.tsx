"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { selectCategories, toggleCategory } from "../../model"

type CategoryFilterProps = {
  /** Available categories from products */
  categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const dispatch = useAppDispatch()
  const selectedCategories = useAppSelector(selectCategories)

  const handleToggle = (category: string) => {
    dispatch(toggleCategory(category))
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="text-sm font-medium text-foreground">Categories:</span>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <label
              key={category}
              className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(category)}
                className="cursor-pointer rounded border-input text-primary focus:ring-ring"
              />
              <span className="capitalize text-muted-foreground peer-checked:text-foreground">
                {category}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
