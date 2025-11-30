"use client"

import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { RangeSlider } from "@/shared/ui"

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

  // Use priceRange as default values if filters are null
  const currentMin = minPrice ?? priceRange.min
  const currentMax = maxPrice ?? priceRange.max

  const handleValueChange = (value: [number, number]) => {
    const [newMin, newMax] = value

    // Only dispatch if values differ from the priceRange defaults
    // This prevents setting filters when they match the full range
    dispatch(setMinPrice(newMin === priceRange.min ? null : newMin))
    dispatch(setMaxPrice(newMax === priceRange.max ? null : newMax))
  }

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="flex flex-col gap-2 min-w-[200px] sm:max-w-[400px] flex-1">
      <span className="text-sm font-medium text-foreground">Price range:</span>
      <RangeSlider
        min={priceRange.min}
        max={priceRange.max}
        step={1}
        value={[currentMin, currentMax]}
        onValueChange={handleValueChange}
        formatValue={formatValue}
        showValues
        className="w-full"
      />
    </div>
  )
}
