import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

import { mergeLocalProducts } from "../lib"

/**
 * Select the entire local products state
 */
export const selectLocalProductsState = (state: RootState) =>
  state.localProducts

/**
 * Select local products map
 */
export const selectLocalProductsById = (state: RootState) =>
  state.localProducts.localProductsById

/**
 * Select removed API product IDs
 */
export const selectRemovedApiIds = (state: RootState) =>
  state.localProducts.removedApiIds

/**
 * Select a specific local product by ID
 * Returns undefined if not found
 */
export const selectLocalProductById = createSelector(
  [selectLocalProductsById, (_state: RootState, id: number) => id],
  (localProductsById, id) => localProductsById[id]?.data
)

/**
 * Factory selector: check if a specific product is removed
 * Works for both API and local products
 * Use with useMemo in components for proper memoization
 */
export const makeSelectIsRemoved = () =>
  createSelector(
    [selectRemovedApiIds, (_state: RootState, productId: number) => productId],
    (removedApiIds, productId) => removedApiIds.includes(productId)
  )

/**
 * Select all local products as array
 * Useful for merging with API products
 */
export const selectLocalProductsArray = createSelector(
  [selectLocalProductsById],
  (localProductsById) => {
    return Object.values(localProductsById)
      .filter((entry) => entry.source === "local")
      .map((entry) => entry.data)
  }
)

/**
 * Check if a product is a local creation (negative ID)
 */
export const selectIsLocalProduct = createSelector(
  [(_state: RootState, id: number) => id],
  (id) => id < 0
)

/**
 * Factory function for creating a memoized selector that merges API products with local changes
 * Returns a selector that takes (state, products) and returns merged products
 *
 * Applies all transformations:
 * 1. Remove soft-deleted products
 * 2. Apply local patches
 * 3. Add locally created products
 * 4. Sort alphabetically by title
 *
 * Usage:
 * ```ts
 * const selectMergedProducts = useMemo(() => makeSelectMergedProducts(), [])
 * const merged = useAppSelector(state => selectMergedProducts(state, apiProducts))
 * ```
 */
export const makeSelectMergedProducts = () =>
  createSelector(
    [
      // Extract products from second argument
      (_state: RootState, products: Product[] | undefined) => products,
      // Extract local products state
      selectLocalProductsById,
      selectRemovedApiIds,
    ],
    (products, localProductsById, removedApiIds) => {
      if (!products || products.length === 0) {
        // If no API products, check if we have local products
        const localProducts = Object.values(localProductsById)
          .filter((entry) => entry.source === "local")
          .map((entry) => entry.data)

        if (localProducts.length === 0) return undefined

        // Return sorted local products
        return localProducts.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        )
      }

      // Merge API products with local changes
      return mergeLocalProducts(products, localProductsById, removedApiIds)
    }
  )
