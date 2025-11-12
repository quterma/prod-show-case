import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export const PAGE_SIZE = 10

type PaginationState = {
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
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload)
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

export const { setPage, setPageSize, resetPage } = paginationSlice.actions
export default paginationSlice.reducer
