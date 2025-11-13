import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

/**
 * Simple selector for favorite IDs
 */
export const selectFavoriteIds = (state: RootState) =>
  state.favorites.favoriteIds

/**
 * Check if a specific product is favorited
 */
export const makeSelectIsFavorite = () =>
  createSelector(
    [selectFavoriteIds, (_state: RootState, productId: number) => productId],
    (favoriteIds, productId) => favoriteIds.includes(productId)
  )

/**
 * Factory selector for filtering products to only favorites
 * Accepts products array as parameter and returns only favorited ones
 * Returns undefined if products is undefined
 */
export const makeSelectFavoriteProducts = () =>
  createSelector(
    [
      selectFavoriteIds,
      (_state: RootState, products: Product[] | undefined) => products,
    ],
    (favoriteIds, products) => {
      if (!products) return undefined

      // Filter products to only those with IDs in favoriteIds
      return products.filter((product) => favoriteIds.includes(product.id))
    }
  )
