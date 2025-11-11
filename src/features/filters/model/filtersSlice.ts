import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

/**
 * Filters state shape
 */
export type FiltersState = {
  /** Search query for product title/description */
  search: string
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
  search: "",
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
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
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
     * Set price range (min and max together)
     */
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) => {
      state.minPrice = action.payload.min
      state.maxPrice = action.payload.max
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
    toggleFavorites: (state) => {
      state.showOnlyFavorites = !state.showOnlyFavorites
    },

    /**
     * Reset all filters to initial state
     */
    resetFilters: () => initialState,
  },
})

export const {
  setSearch,
  toggleCategory,
  setCategories,
  setPriceRange,
  setMinRating,
  toggleFavorites,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer
