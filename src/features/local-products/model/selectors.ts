import { createSelector } from "@reduxjs/toolkit"

import type { Product, ProductId } from "@/entities/product"
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
 * Select removed product IDs (both local and API)
 */
export const selectRemovedProductIds = (state: RootState) =>
  state.localProducts.removedProductIds

/**
 * Select a specific local product by ID
 * Returns undefined if not found
 */
export const selectLocalProductById = createSelector(
  [selectLocalProductsById, (_state: RootState, id: ProductId) => id],
  (localProductsById, id) => localProductsById[id]
)

/**
 * Factory selector: check if a specific product is removed
 * Works for both API and local products
 * Use with useMemo in components for proper memoization
 */
export const makeSelectIsRemoved = () =>
  createSelector(
    [
      selectRemovedProductIds,
      (_state: RootState, productId: ProductId) => productId,
    ],
    (removedProductIds, productId) => removedProductIds.includes(productId)
  )

/**
 * Select all local products as array
 * Filters out products that start with "local_" prefix
 * Useful for merging with API products
 */
export const selectLocalProductsArray = createSelector(
  [selectLocalProductsById],
  (localProductsById) => {
    return Object.values(localProductsById).filter((product) =>
      product.id.startsWith("local_")
    )
  }
)

/**
 * Check if a product is a local creation (ID starts with "local_")
 */
export const selectIsLocalProduct = createSelector(
  [(_state: RootState, id: ProductId) => id],
  (id) => id.startsWith("local_")
)

/**
 * Factory function for creating a memoized selector that merges a single product with local changes
 * Returns a selector that takes (state, productId, apiProduct) and returns merged product or null
 *
 * Simplified logic (no source checks):
 * - If product in removedProductIds: return null (soft-deleted)
 * - If product in localProductsById: return local version (created or patched)
 * - Otherwise: return apiProduct (or null if undefined)
 *
 * Usage:
 * ```ts
 * const selectMergedProduct = useMemo(() => makeSelectMergedProduct(), [])
 * const product = useAppSelector(state => selectMergedProduct(state, productId, apiProduct))
 * ```
 */
export const makeSelectMergedProduct = () =>
  createSelector(
    [
      (_state: RootState, productId: ProductId, _apiProduct?: Product) =>
        productId,
      (_state: RootState, _productId: ProductId, apiProduct?: Product) =>
        apiProduct,
      selectLocalProductsById,
      selectRemovedProductIds,
    ],
    (productId, apiProduct, localProductsById, removedProductIds) => {
      // Check if soft-deleted
      if (removedProductIds.includes(productId)) {
        return null
      }

      // Check if has local version (created or patched)
      const localProduct = localProductsById[productId]
      if (localProduct) {
        return localProduct
      }

      // Return API product or null
      return apiProduct ?? null
    }
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
      selectRemovedProductIds,
    ],
    (products, localProductsById, removedProductIds) => {
      if (!products || products.length === 0) {
        // If no API products, check if we have local products
        const localProducts = Object.values(localProductsById).filter(
          (product) => product.id.startsWith("local_")
        )

        if (localProducts.length === 0) return undefined

        // Return sorted local products
        return localProducts.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        )
      }

      // Merge API products with local changes
      return mergeLocalProducts(products, localProductsById, removedProductIds)
    }
  )
