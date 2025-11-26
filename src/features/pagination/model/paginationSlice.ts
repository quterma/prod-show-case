import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * Default page size for product grid pagination
 * Desktop (≥ 768px): 12 items (4 cols × 3 rows on desktop, 3 cols × 4 rows on tablet)
 * Mobile (< 768px): pagination disabled, shows all items
 */
export const DEFAULT_PAGE_SIZE = 12

export type PaginationState = {
  currentPage: number
  pageSize: number
}

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    /**
     * Set current page
     * Note: Bounds validation should be done in UI layer with totalPages
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload)
    },
    /**
     * Set page size and reset to first page
     */
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1
    },
    /**
     * Reset to first page
     */
    resetCurrentPage: (state) => {
      state.currentPage = 1
    },
  },
})

export const { setCurrentPage, setPageSize, resetCurrentPage } =
  paginationSlice.actions
export default paginationSlice.reducer
