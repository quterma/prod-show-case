import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { safeLoadFromStorage } from "@/shared/lib/persist"

/**
 * Storage key for favorites (versioned)
 * Format: "app:{feature}:v{version}"
 */
export const FAVORITES_STORAGE_KEY = "app:favorites:v1"

export type FavoritesState = {
  /** Array of favorite product IDs */
  favoriteIds: number[]
  /** Show only favorite products filter (runtime-only, not persisted) */
  showOnlyFavorites: boolean
}

/**
 * Default state for favorites (used as fallback)
 */
const defaultFavoritesState: FavoritesState = {
  favoriteIds: [],
  showOnlyFavorites: false,
}

/**
 * Hydration getter for favorites
 * Use this in store.ts preloadedState to load from localStorage
 * NOTE: Only favoriteIds is persisted, showOnlyFavorites is always false on load
 */
export function getInitialFavoritesState(): FavoritesState {
  const persisted = safeLoadFromStorage<Pick<FavoritesState, "favoriteIds">>(
    FAVORITES_STORAGE_KEY,
    { favoriteIds: [] }
  )

  return {
    ...defaultFavoritesState,
    favoriteIds: persisted.favoriteIds,
  }
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
     * Toggle "show only favorites" filter
     */
    toggleShowOnlyFavorites: (state) => {
      state.showOnlyFavorites = !state.showOnlyFavorites
    },

    /**
     * Clear all favorites
     * Used by "Reset local data" button
     */
    resetFavorites: (state) => {
      state.favoriteIds = []
      state.showOnlyFavorites = false
    },
  },
})

export const {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  toggleShowOnlyFavorites,
  resetFavorites,
} = favoritesSlice.actions

export default favoritesSlice.reducer
