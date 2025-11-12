"use client"

import { useEffect, useState } from "react"

import { useDebounce } from "@/shared/lib/debounce"
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks"

import { selectSearchQuery, setSearchQuery } from "../../model"

/**
 * Query filter component with debounced search input
 * Manages local state for instant UI feedback and debounced Redux dispatch
 */
export function QueryFilter() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)

  // Local state for instant UI feedback
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounce local query value
  const debouncedQuery = useDebounce(localQuery, 300)

  // Dispatch to Redux when debounced value changes
  useEffect(() => {
    dispatch(setSearchQuery(debouncedQuery))
  }, [debouncedQuery, dispatch])

  // Sync local state with Redux when external changes occur (e.g., reset filters)
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value) // Update UI instantly
  }

  return (
    <input
      type="search"
      value={localQuery}
      onChange={handleChange}
      placeholder="Search products..."
      className="search-input"
    />
  )
}
