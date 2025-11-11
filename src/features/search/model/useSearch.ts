import { useEffect, useState } from "react"

/**
 * Hook for managing search input with debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns Object with search query, debounced query, and setter
 */
export function useSearch(delay = 300) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchQuery, delay])

  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
  }
}
