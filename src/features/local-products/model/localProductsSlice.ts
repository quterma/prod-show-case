import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product/model"

/**
 * Local product entry: stores product data and source (local or API override)
 */
type LocalProductEntry = {
  id: number
  data: Product
  source: "local" | "api"
}

/**
 * State for local products management
 * - localProductsById: stores created/modified products (local creations + API overrides)
 * - removedApiIds: tracks soft-deleted API products (local products are just removed from localProductsById)
 */
type LocalProductsState = {
  /** Map of product ID to local product entry */
  localProductsById: Record<number, LocalProductEntry>
  /** IDs of removed API products (local products are deleted directly) */
  removedApiIds: number[]
  /** Next ID for locally created products (negative, auto-decrement) */
  nextLocalId: number
}

const initialState: LocalProductsState = {
  localProductsById: {},
  removedApiIds: [],
  nextLocalId: -1,
}

/**
 * Local products slice - manages local products, API overrides, and soft-deletions
 * Replaces old removedSlice with unified product modification logic
 *
 * Features:
 * - Create local products (negative IDs)
 * - Override API products (store modifications)
 * - Soft-delete products (local = remove from map, API = add to removedApiIds)
 * - Reset all local data
 *
 * NOTE: Persistence is not included in this version (will be added separately)
 */
const localProductsSlice = createSlice({
  name: "localProducts",
  initialState,
  reducers: {
    /**
     * Upsert a local product or API override
     * - For new local products: provide id=undefined, auto-assign negative ID
     * - For API overrides: provide existing positive ID
     * - For updates: provide existing ID (positive or negative)
     */
    upsertLocalProduct: (
      state,
      action: PayloadAction<{
        id?: number
        data: Omit<Product, "id">
        source: "local" | "api"
      }>
    ) => {
      const { id, data, source } = action.payload

      // Auto-assign ID for new local products
      const productId = id !== undefined ? id : state.nextLocalId

      // Create full product with ID
      const product: Product = {
        ...data,
        id: productId,
      }

      // Store entry
      state.localProductsById[productId] = {
        id: productId,
        data: product,
        source,
      }

      // Decrement nextLocalId only for new local products
      if (id === undefined && source === "local") {
        state.nextLocalId -= 1
      }

      // If updating a previously removed API product, restore it
      if (source === "api" && productId > 0) {
        const index = state.removedApiIds.indexOf(productId)
        if (index !== -1) {
          state.removedApiIds.splice(index, 1)
        }
      }
    },

    /**
     * Remove a product
     * - If local product (id in localProductsById with source="local"): delete from map
     * - If API product: add to removedApiIds + remove any override from map
     * - If already in removedApiIds: remove from list (restore)
     */
    removeProduct: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const entry = state.localProductsById[id]

      // Check if already removed (toggle restore)
      const removedIndex = state.removedApiIds.indexOf(id)
      if (removedIndex !== -1) {
        // Restore: remove from removedApiIds
        state.removedApiIds.splice(removedIndex, 1)
        return
      }

      // Case 1: Local product → delete from map
      if (entry?.source === "local") {
        delete state.localProductsById[id]
        return
      }

      // Case 2: API product or override → add to removedApiIds and delete override
      if (id > 0) {
        state.removedApiIds.push(id)
        if (entry) {
          delete state.localProductsById[id]
        }
      }
    },

    /**
     * Clear all local data
     * Used by reset-local-data feature
     */
    resetLocalProducts: (state) => {
      state.localProductsById = {}
      state.removedApiIds = []
      state.nextLocalId = -1
    },
  },
})

export const { upsertLocalProduct, removeProduct, resetLocalProducts } =
  localProductsSlice.actions

export default localProductsSlice.reducer
