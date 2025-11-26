"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"

import { useDebounce } from "@/shared/lib/debounce"
import { useAppDispatch, useAppSelector } from "@/shared/lib/store"
import { Button, Input } from "@/shared/ui"

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

  const handleClear = () => {
    setLocalQuery("")
  }

  return (
    <div className="w-full sm:w-64">
      <Input
        type="search"
        placeholder="Search products..."
        value={localQuery}
        onChange={handleChange}
        iconLeft={<Search className="w-4 h-4" />}
        iconRight={
          localQuery ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          ) : undefined
        }
        fullWidth
      />
    </div>
  )
}
