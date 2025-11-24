"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { selectMinRating, setMinRating } from "../../model"

const RATING_OPTIONS = [
  { value: 4, label: "4+ stars" },
  { value: 3, label: "3+ stars" },
  { value: 2, label: "2+ stars" },
] as const

export function RatingFilter() {
  const dispatch = useAppDispatch()
  const minRating = useAppSelector(selectMinRating)

  const handleChange = (value: number | null) => {
    dispatch(setMinRating(value))
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground">Rating:</span>
      <select
        value={minRating ?? ""}
        onChange={(e) =>
          handleChange(e.target.value === "" ? null : Number(e.target.value))
        }
        className="px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        <option value="">All ratings</option>
        {RATING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
