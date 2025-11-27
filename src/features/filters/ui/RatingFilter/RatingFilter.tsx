"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { Select } from "@/shared/ui"

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
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Rating:</span>
      <Select
        value={minRating ?? ""}
        onChange={(val) => handleChange(val === "" ? null : Number(val))}
        options={[
          { value: "", label: "All ratings" },
          ...RATING_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
          })),
        ]}
        className="w-40"
      />
    </div>
  )
}
