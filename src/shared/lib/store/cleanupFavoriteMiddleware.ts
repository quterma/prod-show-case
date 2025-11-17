import type { Middleware } from "@reduxjs/toolkit"

import { removeFavorite } from "@/features/favorites"
import { removeProduct } from "@/features/local-products"

/**
 * Cleanup favorite middleware - auto-removes products from favorites when deleted
 *
 * Purpose: When a product is removed via local-products feature, automatically
 * clean it up from the favorites list to maintain data consistency.
 *
 * This prevents orphaned favorite IDs and keeps the favorites count accurate.
 *
 * @example
 * // When user clicks "Remove" button:
 * dispatch(removeProduct(42))
 * // -> middleware automatically dispatches:
 * dispatch(removeFavorite(42))
 */
export const createCleanupFavoriteMiddleware = (): Middleware => {
  return (api) => (next) => (action) => {
    // Execute the original action first
    const result = next(action)

    // Handle cleanup after the action is processed
    if (removeProduct.match(action)) {
      const productId = action.payload
      // Auto-cleanup: remove from favorites when product is deleted
      api.dispatch(removeFavorite(productId))
    }

    return result
  }
}
