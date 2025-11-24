import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export const PAGE_SIZE = 10

export type PaginationState = {
  currentPage: number
  pageSize: number
}

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: PAGE_SIZE,
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
    resetPage: (state) => {
      state.currentPage = 1
    },
  },
})

export const { setCurrentPage, setPageSize, resetPage } =
  paginationSlice.actions
export default paginationSlice.reducer
