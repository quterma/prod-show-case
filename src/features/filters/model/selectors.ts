import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product/model"
import type { RootState } from "@/shared/lib/store"

import {
  filterBySearch,
  filterByCategories,
  filterByRating,
  filterByFavorites,
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
export const selectShowOnlyFavorites = (state: RootState) =>
  state.filters.showOnlyFavorites

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
    selectShowOnlyFavorites,
  ],
  (searchQuery, categories, minPrice, maxPrice, minRating, showOnlyFavorites) =>
    Boolean(
      searchQuery.trim() ||
        categories.length > 0 ||
        minPrice !== null ||
        maxPrice !== null ||
        minRating !== null ||
        showOnlyFavorites
    )
)

/**
 * Factory function for creating a memoized selector that filters products
 * Returns a selector that takes (state, products) and returns filtered products
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
      selectShowOnlyFavorites,
      selectMinPrice,
      selectMaxPrice,
    ],
    (
      products,
      searchQuery,
      categories,
      minRating,
      showOnlyFavorites,
      minPrice,
      maxPrice
    ) => {
      if (!products || products.length === 0) return undefined

      // Apply filters sequentially (cascade pattern)
      let result = products
      result = filterBySearch(result, searchQuery)
      result = filterByCategories(result, categories)
      result = filterByRating(result, minRating)
      result = filterByFavorites(result, showOnlyFavorites)
      result = filterByPrice(result, minPrice, maxPrice)

      return result
    }
  )
