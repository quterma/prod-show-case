import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

/**
 * Simple selector for favorite IDs
 */
export const selectFavoriteIds = (state: RootState) =>
  state.favorites.favoriteIds

/**
 * Simple selector for showOnlyFavorites flag
 */
export const selectShowOnlyFavorites = (state: RootState) =>
  state.favorites.showOnlyFavorites

/**
 * Check if a specific product is favorited
 */
export const makeSelectIsFavorite = () =>
  createSelector(
    [selectFavoriteIds, (_state: RootState, productId: number) => productId],
    (favoriteIds, productId) => favoriteIds.includes(productId)
  )

/**
 * Factory selector for filtering products based on favorites feature state
 * - If showOnlyFavorites is true: returns only favorited products
 * - If showOnlyFavorites is false: returns all products unchanged
 * Returns undefined if products is undefined
 */
export const makeSelectFavoriteProducts = () =>
  createSelector(
    [
      selectFavoriteIds,
      selectShowOnlyFavorites,
      (_state: RootState, products: Product[] | undefined) => products,
    ],
    (favoriteIds, showOnlyFavorites, products) => {
      if (!products) return undefined

      // If not filtering by favorites, return all products
      if (!showOnlyFavorites) return products

      // Filter products to only those with IDs in favoriteIds
      return products.filter((product) => favoriteIds.includes(product.id))
    }
  )
