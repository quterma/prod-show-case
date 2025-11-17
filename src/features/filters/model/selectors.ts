import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

import {
  filterBySearch,
  filterByCategories,
  filterByRating,
  filterByPrice,
} from "../lib"

/**
 * Simple selectors for individual filter values
 */
export const selectSearchQuery = (state: RootState) => state.filters.searchQuery
export const selectCategories = (state: RootState) => state.filters.categories
export const selectMinPrice = (state: RootState) => state.filters.minPrice
export const selectMaxPrice = (state: RootState) => state.filters.maxPrice
export const selectMinRating = (state: RootState) => state.filters.minRating

/**
 * Memoized selector to check if any filters are active
 */
export const selectHasActiveFilters = createSelector(
  [
    selectSearchQuery,
    selectCategories,
    selectMinPrice,
    selectMaxPrice,
    selectMinRating,
  ],
  (searchQuery, categories, minPrice, maxPrice, minRating) =>
    Boolean(
      searchQuery.trim() ||
        categories.length > 0 ||
        minPrice !== null ||
        maxPrice !== null ||
        minRating !== null
    )
)

/**
 * Factory function for creating a memoized selector that filters products
 * Returns a selector that takes (state, products) and returns filtered products
 *
 * NOTE: This selector only handles filters feature concerns (search, category, price, rating).
 * Filtering by removed products and favorites should be handled in widget-level composition.
 *
 * Usage:
 * ```ts
 * const selectFilteredProducts = useMemo(() => makeSelectFilteredProducts(), [])
 * const filtered = useAppSelector(state => selectFilteredProducts(state, products))
 * ```
 */
export const makeSelectFilteredProducts = () =>
  createSelector(
    [
      // Extract products from second argument
      (_state: RootState, products: Product[] | undefined) => products,
      // Extract individual filter values from state
      selectSearchQuery,
      selectCategories,
      selectMinRating,
      selectMinPrice,
      selectMaxPrice,
    ],
    (products, searchQuery, categories, minRating, minPrice, maxPrice) => {
      if (!products || products.length === 0) return undefined

      // Apply filters sequentially (cascade pattern)
      let result = products
      result = filterBySearch(result, searchQuery)
      result = filterByCategories(result, categories)
      result = filterByRating(result, minRating)
      result = filterByPrice(result, minPrice, maxPrice)

      return result
    }
  )
