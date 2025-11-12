import { useMemo } from "react"

import type { Product } from "@/entities/product/model"
import { useDebounce } from "@/shared/lib/debounce"
import { useAppSelector } from "@/shared/lib/hooks"

import {
  filterBySearch,
  filterByCategories,
  filterByRating,
  filterByFavorites,
  filterByPrice,
} from "../lib"

export type ProductFiltersResult = {
  filteredProducts: Product[]
  hasActiveFilters: boolean
}

/**
 * Composite hook for managing product filters with Redux state
 *
 * @param products - Products to filter
 * @param debounceDelay - Debounce delay for search in milliseconds (default: 300)
 * @returns Filtered products and active filters flag
 *
 * @example
 * const { filteredProducts, hasActiveFilters } = useProductFilters(products)
 * // Access filters state from Redux: useAppSelector(state => state.filters)
 * // Dispatch actions: dispatch(setSearchQuery('query'))
 */
export function useProductFilters(
  products: Product[] | undefined,
  debounceDelay = 300
): ProductFiltersResult {
  // Get filters state from Redux
  const filters = useAppSelector((state) => state.filters)

  // Debounce search query to reduce re-renders
  const debouncedSearch = useDebounce(filters.searchQuery, debounceDelay)

  // Check if any filters are active (memoized for performance)
  const hasActiveFilters = useMemo(
    () =>
      debouncedSearch.trim() !== "" ||
      filters.categories.length > 0 ||
      filters.showOnlyFavorites ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.minRating !== null,
    [
      debouncedSearch,
      filters.categories,
      filters.showOnlyFavorites,
      filters.minPrice,
      filters.maxPrice,
      filters.minRating,
    ]
  )

  // Apply all filters sequentially with memoization (cascade pattern)
  const filteredProducts = useMemo(() => {
    if (!products) return []

    // Pure functional cascade: each helper handles its own conditions
    let result = products
    result = filterBySearch(result, debouncedSearch)
    result = filterByCategories(result, filters.categories)
    result = filterByRating(result, filters.minRating)
    result = filterByFavorites(result, filters.showOnlyFavorites)
    result = filterByPrice(result, filters.minPrice, filters.maxPrice)

    return result
  }, [
    products,
    debouncedSearch,
    filters.categories,
    filters.minRating,
    filters.showOnlyFavorites,
    filters.minPrice,
    filters.maxPrice,
  ])

  return {
    filteredProducts,
    hasActiveFilters,
  }
}
