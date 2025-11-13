import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

/**
 * Select all removed product IDs
 */
export const selectRemovedIds = (state: RootState) => state.removed.removedIds

/**
 * Factory selector: check if a specific product is removed
 * Use with useMemo in components for proper memoization
 */
export const makeSelectIsRemoved = () =>
  createSelector(
    [selectRemovedIds, (_state: RootState, productId: number) => productId],
    (removedIds, productId) => removedIds.includes(productId)
  )

/**
 * Factory selector: filter out removed products
 * Returns only visible (non-removed) products
 */
export const makeSelectVisibleProducts = () =>
  createSelector(
    [
      selectRemovedIds,
      (_state: RootState, products: Product[] | undefined) => products,
    ],
    (removedIds, products) => {
      if (!products) return undefined
      return products.filter((product) => !removedIds.includes(product.id))
    }
  )
