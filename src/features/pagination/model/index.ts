export {
  PAGE_SIZE,
  setCurrentPage,
  setPageSize,
  resetPage,
} from "./paginationSlice"
export { default as paginationReducer } from "./paginationSlice"
export type { PaginationState } from "./paginationSlice"

export {
  selectCurrentPage,
  selectPageSize,
  makeSelectPaginatedProducts,
} from "./selectors"
