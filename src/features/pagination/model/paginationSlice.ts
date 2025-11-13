import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export const PAGE_SIZE = 10

type PaginationState = {
  currentPage: number
  pageSize: number
  maxPage: number | null // null when data not loaded yet
}

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: PAGE_SIZE,
  maxPage: null,
}

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      const page = action.payload
      // Clamp page between 1 and maxPage (if known)
      if (page < 1) {
        state.currentPage = 1
      } else if (state.maxPage !== null && page > state.maxPage) {
        state.currentPage = state.maxPage
      } else {
        state.currentPage = page
      }
    },
    setMaxPage: (state, action: PayloadAction<number>) => {
      state.maxPage = Math.max(1, action.payload)
      // Auto-correct currentPage if it exceeds new maxPage
      if (state.currentPage > state.maxPage) {
        state.currentPage = state.maxPage
      }
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1 // Reset to first page when changing page size
    },
    resetPage: (state) => {
      state.currentPage = 1
    },
  },
})

export const { setPage, setMaxPage, setPageSize, resetPage } =
  paginationSlice.actions
export default paginationSlice.reducer
