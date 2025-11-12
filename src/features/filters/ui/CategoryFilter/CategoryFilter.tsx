import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"

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
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Categories:</span>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <label
              key={category}
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(category)}
                className="cursor-pointer"
              />
              <span className="capitalize">{category}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
