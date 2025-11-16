import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { removeProduct } from "@/features/local-products/model/localProductsSlice"
import { safeLoadFromStorage } from "@/shared/lib/persist"

/**
 * Storage key for favorites (versioned)
 * Format: "app:{feature}:v{version}"
 */
export const FAVORITES_STORAGE_KEY = "app:favorites:v1"

export type FavoritesState = {
  /** Array of favorite product IDs */
  favoriteIds: number[]
}

/**
 * Default state for favorites (used as fallback)
 */
const defaultFavoritesState: FavoritesState = {
  favoriteIds: [],
}

/**
 * Hydration getter for favorites
 * Use this in store.ts preloadedState to load from localStorage
 */
export function getInitialFavoritesState(): FavoritesState {
  return safeLoadFromStorage(FAVORITES_STORAGE_KEY, defaultFavoritesState)
}

/**
 * Initial state for favorites (pure default, no side effects)
 * Hydration happens via preloadedState in store.ts
 */
const initialState: FavoritesState = defaultFavoritesState

/**
 * Favorites slice - manages favorite product IDs with localStorage persistence
 * Only stores IDs, not full product data (avoids duplication with RTK Query cache)
 */
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    /**
     * Toggle favorite status for a product
     * Adds if not present, removes if already favorited
     */
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.favoriteIds.indexOf(id)

      if (index === -1) {
        // Add to favorites
        state.favoriteIds.push(id)
      } else {
        // Remove from favorites
        state.favoriteIds.splice(index, 1)
      }
    },

    /**
     * Add product to favorites (idempotent - does nothing if already favorited)
     */
    addFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (!state.favoriteIds.includes(id)) {
        state.favoriteIds.push(id)
      }
    },

    /**
     * Remove product from favorites (idempotent - does nothing if not favorited)
     */
    removeFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.favoriteIds.indexOf(id)

      if (index !== -1) {
        state.favoriteIds.splice(index, 1)
      }
    },

    /**
     * Clear all favorites
     * Used by "Reset local data" button
     */
    resetFavorites: (state) => {
      state.favoriteIds = []
    },
  },
  extraReducers: (builder) => {
    // Auto-remove from favorites when product is removed
    builder.addCase(removeProduct, (state, action) => {
      const productId = action.payload
      const index = state.favoriteIds.indexOf(productId)
      if (index !== -1) {
        state.favoriteIds.splice(index, 1)
      }
    })
  },
})

export const { toggleFavorite, addFavorite, removeFavorite, resetFavorites } =
  favoritesSlice.actions

export default favoritesSlice.reducer
