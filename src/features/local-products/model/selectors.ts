import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product/model"
import type { RootState } from "@/shared/lib/store"

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
 * Factory selector: filter out removed products from a list
 * Returns only visible (non-removed) products
 * Compatible with existing filterByRemoved usage
 */
export const makeSelectVisibleProducts = () =>
  createSelector(
    [
      selectRemovedApiIds,
      (_state: RootState, products: Product[] | undefined) => products,
    ],
    (removedApiIds, products) => {
      if (!products) return undefined
      return products.filter((product) => !removedApiIds.includes(product.id))
    }
  )

/**
 * Check if a product is a local creation (negative ID)
 */
export const selectIsLocalProduct = createSelector(
  [(_state: RootState, id: number) => id],
  (id) => id < 0
)
