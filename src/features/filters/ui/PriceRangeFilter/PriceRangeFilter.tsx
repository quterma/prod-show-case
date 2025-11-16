"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import {
  selectMinPrice,
  selectMaxPrice,
  setMinPrice,
  setMaxPrice,
} from "../../model"

type PriceRangeFilterProps = {
  /** Available price range from products */
  priceRange: { min: number; max: number }
}

export function PriceRangeFilter({ priceRange }: PriceRangeFilterProps) {
  const dispatch = useAppDispatch()
  const minPrice = useAppSelector(selectMinPrice)
  const maxPrice = useAppSelector(selectMaxPrice)

  const handleMinChange = (value: string) => {
    const numValue = value === "" ? null : Number(value)
    dispatch(setMinPrice(numValue))
  }

  const handleMaxChange = (value: string) => {
    const numValue = value === "" ? null : Number(value)
    dispatch(setMaxPrice(numValue))
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Price:</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={`Min (${priceRange.min})`}
          value={minPrice ?? ""}
          onChange={(e) => handleMinChange(e.target.value)}
          min={priceRange.min}
          max={priceRange.max}
          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder={`Max (${priceRange.max})`}
          value={maxPrice ?? ""}
          onChange={(e) => handleMaxChange(e.target.value)}
          min={priceRange.min}
          max={priceRange.max}
          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
