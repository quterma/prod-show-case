import { useMemo, useState } from "react"

import type { Product } from "@/entities/product/model"
import { useDebounce } from "@/shared/lib/debounce"

import {
  filterBySearch,
  filterByCategory,
  filterByFavorites,
  filterByPrice,
} from "../lib"

export type ProductFiltersState = {
  search: string
  category: string | null
  showOnlyFavorites: boolean
  minPrice: number | null
  maxPrice: number | null
}

export type ProductFiltersSetters = {
  setSearch: (value: string) => void
  setCategory: (value: string | null) => void
  setShowOnlyFavorites: (value: boolean) => void
  setMinPrice: (value: number | null) => void
  setMaxPrice: (value: number | null) => void
  resetFilters: () => void
}

export type ProductFiltersResult = {
  filteredProducts: Product[]
  filters: ProductFiltersState
  setters: ProductFiltersSetters
  hasActiveFilters: boolean
}

const DEFAULT_FILTERS: ProductFiltersState = {
  search: "",
  category: null,
  showOnlyFavorites: false,
  minPrice: null,
  maxPrice: null,
}

/**
 * Composite hook for managing product filters with debounced search
 *
 * @param products - Products to filter
 * @param debounceDelay - Debounce delay for search in milliseconds (default: 300)
 * @returns Filtered products, filter state, and setters
 *
 * @example
 * const { filteredProducts, filters, setters } = useProductFilters(products)
 * <SearchInput value={filters.search} onChange={setters.setSearch} />
 */
export function useProductFilters(
  products: Product[] | undefined,
  debounceDelay = 300
): ProductFiltersResult {
  // Filter state (local) - initialize with defaults
  const [search, setSearch] = useState(DEFAULT_FILTERS.search)
  const [category, setCategory] = useState<string | null>(
    DEFAULT_FILTERS.category
  )
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(
    DEFAULT_FILTERS.showOnlyFavorites
  )
  const [minPrice, setMinPrice] = useState<number | null>(
    DEFAULT_FILTERS.minPrice
  )
  const [maxPrice, setMaxPrice] = useState<number | null>(
    DEFAULT_FILTERS.maxPrice
  )

  // Debounce search query to reduce re-renders
  const debouncedSearch = useDebounce(search, debounceDelay)

  // Reset all filters to default
  const resetFilters = () => {
    setSearch(DEFAULT_FILTERS.search)
    setCategory(DEFAULT_FILTERS.category)
    setShowOnlyFavorites(DEFAULT_FILTERS.showOnlyFavorites)
    setMinPrice(DEFAULT_FILTERS.minPrice)
    setMaxPrice(DEFAULT_FILTERS.maxPrice)
  }

  // Check if any filters are active (memoized for performance)
  const hasActiveFilters = useMemo(
    () =>
      debouncedSearch.trim() !== "" ||
      category !== null ||
      showOnlyFavorites ||
      minPrice !== null ||
      maxPrice !== null,
    [debouncedSearch, category, showOnlyFavorites, minPrice, maxPrice]
  )

  // Apply all filters sequentially with memoization
  const filteredProducts = useMemo(() => {
    if (!products) return []

    let result = products

    // Apply filters in order
    result = filterBySearch(result, debouncedSearch)
    result = filterByCategory(result, category)
    result = filterByFavorites(result, showOnlyFavorites)
    result = filterByPrice(result, minPrice, maxPrice)

    return result
  }, [
    products,
    debouncedSearch,
    category,
    showOnlyFavorites,
    minPrice,
    maxPrice,
  ])

  // Memoize setters to prevent unnecessary re-renders in child components
  const setters = useMemo(
    () => ({
      setSearch,
      setCategory,
      setShowOnlyFavorites,
      setMinPrice,
      setMaxPrice,
      resetFilters,
    }),
    []
  )

  return {
    filteredProducts,
    filters: {
      search,
      category,
      showOnlyFavorites,
      minPrice,
      maxPrice,
    },
    setters,
    hasActiveFilters,
  }
}
