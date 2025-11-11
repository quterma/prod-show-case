import { useEffect, useState } from "react"

/**
 * Debounce hook - delays updating a value until after a specified delay
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced value
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState("")
 * const debouncedQuery = useDebounce(searchQuery, 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
