import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

/**
 * Filters state shape
 */
export type FiltersState = {
  /** Search query for product title/description */
  searchQuery: string
  /** Selected categories (multi-select) */
  categories: string[]
  /** Minimum price filter */
  minPrice: number | null
  /** Maximum price filter */
  maxPrice: number | null
  /** Minimum rating filter (1-5) */
  minRating: number | null
  /** Show only favorite products */
  showOnlyFavorites: boolean
}

/**
 * Initial/default filters state
 */
const initialState: FiltersState = {
  searchQuery: "",
  categories: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  showOnlyFavorites: false,
}

/**
 * Filters slice - manages product filtering state
 */
const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    /**
     * Toggle category selection (add if not present, remove if present)
     */
    toggleCategory: (state, action: PayloadAction<string>) => {
      const index = state.categories.indexOf(action.payload)
      if (index === -1) {
        state.categories.push(action.payload)
      } else {
        state.categories.splice(index, 1)
      }
    },

    /**
     * Set selected categories (replaces entire array)
     */
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
    },

    /**
     * Set minimum price filter
     */
    setMinPrice: (state, action: PayloadAction<number | null>) => {
      state.minPrice = action.payload
    },

    /**
     * Set maximum price filter
     */
    setMaxPrice: (state, action: PayloadAction<number | null>) => {
      state.maxPrice = action.payload
    },

    /**
     * Set minimum rating filter
     */
    setMinRating: (state, action: PayloadAction<number | null>) => {
      state.minRating = action.payload
    },

    /**
     * Toggle "show only favorites" filter
     */
    toggleShowOnlyFavorites: (state) => {
      state.showOnlyFavorites = !state.showOnlyFavorites
    },

    /**
     * Reset all filters to initial state
     */
    resetFilters: () => initialState,
  },
})

export const {
  setSearchQuery,
  toggleCategory,
  setCategories,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  toggleShowOnlyFavorites,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer
