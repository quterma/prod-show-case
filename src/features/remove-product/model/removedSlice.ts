import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { getFromLS, setToLS } from "@/shared/lib/persist"

const REMOVED_STORAGE_KEY = "prod-showcase:removed"

type RemovedState = {
  removedIds: number[]
}

/**
 * Load initial state from localStorage
 */
function loadInitialState(): RemovedState {
  const stored = getFromLS<number[]>(REMOVED_STORAGE_KEY)
  return {
    removedIds: Array.isArray(stored) ? stored : [],
  }
}

/**
 * removedSlice - manages soft-deleted products
 * Stores only product IDs with localStorage persistence
 */
const removedSlice = createSlice({
  name: "removed",
  initialState: loadInitialState(),
  reducers: {
    /**
     * Toggle removed status for a product
     * Used for UI interactions (single toggle)
     */
    toggleRemoved: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.removedIds.indexOf(id)

      if (index === -1) {
        // Add to removed
        state.removedIds.push(id)
      } else {
        // Remove from removed (restore)
        state.removedIds.splice(index, 1)
      }

      setToLS(REMOVED_STORAGE_KEY, state.removedIds)
    },

    /**
     * Add product to removed list
     * Used for programmatic control (e.g., batch operations)
     */
    addRemoved: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (!state.removedIds.includes(id)) {
        state.removedIds.push(id)
        setToLS(REMOVED_STORAGE_KEY, state.removedIds)
      }
    },

    /**
     * Remove product from removed list (restore)
     * Used for programmatic control
     */
    removeRemoved: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.removedIds.indexOf(id)
      if (index !== -1) {
        state.removedIds.splice(index, 1)
        setToLS(REMOVED_STORAGE_KEY, state.removedIds)
      }
    },

    /**
     * Clear all removed products
     * Used by "Reset local data" feature
     */
    resetRemoved: (state) => {
      state.removedIds = []
      setToLS(REMOVED_STORAGE_KEY, [])
    },
  },
})

export const { toggleRemoved, addRemoved, removeRemoved, resetRemoved } =
  removedSlice.actions

export default removedSlice.reducer
