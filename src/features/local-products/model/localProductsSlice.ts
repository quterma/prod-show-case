import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Product, ProductId } from "@/entities/product"
import { safeLoadFromStorage } from "@/shared/lib/persist"
import { generateLocalProductId } from "@/shared/lib/utils"

/**
 * Storage key for local products
 * Format: "app:{feature}:v{version}"
 */
export const LOCAL_PRODUCTS_STORAGE_KEY = "app:localProducts:v2"

/**
 * Payload for upsertLocalProduct action
 * - id: optional, auto-generated for new local products using nanoid
 * - data: product data without ID
 */
export type UpsertLocalProductPayload = {
  id?: ProductId
  data: Omit<Product, "id">
}

/**
 * State for local products management
 * Simplified to 2 structures:
 * - localProductsById: all created/patched products (local and API overrides)
 * - removedProductIds: all deleted products (local and API)
 */
export type LocalProductsState = {
  /** Map of product ID to product data (both local creations and API patches) */
  localProductsById: Record<ProductId, Product>
  /** IDs of removed products (both local and API products) */
  removedProductIds: ProductId[]
}

/**
 * Default state for local products (used as fallback)
 */
const defaultLocalProductsState: LocalProductsState = {
  localProductsById: {},
  removedProductIds: [],
}

/**
 * Hydration getter for local products
 * Use this in store.ts preloadedState to load from localStorage
 */
export function getInitialLocalProductsState(): LocalProductsState {
  return safeLoadFromStorage<LocalProductsState>(
    LOCAL_PRODUCTS_STORAGE_KEY,
    defaultLocalProductsState
  )
}

/**
 * Initial state for local products (pure default, no side effects)
 * Hydration happens via preloadedState in store.ts
 */
const initialState: LocalProductsState = defaultLocalProductsState

/**
 * Local products slice - manages local products, API overrides, and soft-deletions
 * Simplified to use string-based IDs and unified storage
 *
 * Features:
 * - Create local products (auto-generated ID via nanoid)
 * - Patch API products (store modifications)
 * - Soft-delete products (add to removedProductIds, keep in localProductsById for transparency)
 * - Reset all local data
 *
 * NOTE: Persistence handled via middleware (persistMiddleware)
 */
const localProductsSlice = createSlice({
  name: "localProducts",
  initialState,
  reducers: {
    /**
     * Upsert a local product or API patch
     * - For new local products: provide id=undefined, auto-generate ID via nanoid
     * - For API patches: provide existing API product ID
     * - For updates: provide existing ID (local or API)
     */
    upsertLocalProduct: (
      state,
      action: PayloadAction<UpsertLocalProductPayload>
    ) => {
      const { id, data } = action.payload

      // Auto-generate ID for new local products
      const productId = id !== undefined ? id : generateLocalProductId()

      // Create full product with ID
      const product: Product = {
        ...data,
        id: productId,
      }

      // Store product
      state.localProductsById[productId] = product
    },

    /**
     * Remove a product (universal deletion)
     * - Delete from localProductsById if present (local products or API patches)
     * - Add to removedProductIds to hide from UI
     */
    removeProduct: (state, action: PayloadAction<ProductId>) => {
      const id = action.payload

      // Delete from localProductsById if exists
      if (state.localProductsById[id]) {
        delete state.localProductsById[id]
      }

      // Add to removedProductIds (idempotent)
      if (!state.removedProductIds.includes(id)) {
        state.removedProductIds.push(id)
      }
    },

    /**
     * Clear all local data
     * Used by reset-local-data feature
     */
    resetLocalProducts: (state) => {
      state.localProductsById = {}
      state.removedProductIds = []
    },
  },
})

export const { upsertLocalProduct, removeProduct, resetLocalProducts } =
  localProductsSlice.actions

export default localProductsSlice.reducer
