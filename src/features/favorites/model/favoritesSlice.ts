import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getFromLS, setToLS } from "@/shared/lib/persist/ls"

const FAVORITES_STORAGE_KEY = "prod-showcase:favorites"

type FavoritesState = {
  /** Array of favorite product IDs */
  favoriteIds: number[]
}

/**
 * Load initial favorites from localStorage
 * Returns empty array if no data or parse error
 */
function loadInitialState(): FavoritesState {
  const stored = getFromLS<number[]>(FAVORITES_STORAGE_KEY)
  return {
    favoriteIds: Array.isArray(stored) ? stored : [],
  }
}

const initialState: FavoritesState = loadInitialState()

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

      // Persist to localStorage
      setToLS(FAVORITES_STORAGE_KEY, state.favoriteIds)
    },

    /**
     * Add product to favorites (idempotent - does nothing if already favorited)
     */
    addFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (!state.favoriteIds.includes(id)) {
        state.favoriteIds.push(id)
        setToLS(FAVORITES_STORAGE_KEY, state.favoriteIds)
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
        setToLS(FAVORITES_STORAGE_KEY, state.favoriteIds)
      }
    },

    /**
     * Clear all favorites
     * Used by "Reset local data" button
     */
    resetFavorites: (state) => {
      state.favoriteIds = []
      setToLS(FAVORITES_STORAGE_KEY, [])
    },
  },
})

export const { toggleFavorite, addFavorite, removeFavorite, resetFavorites } =
  favoritesSlice.actions

export default favoritesSlice.reducer
