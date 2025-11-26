export {
  DEFAULT_PAGE_SIZE,
  setCurrentPage,
  setPageSize,
  resetCurrentPage,
} from "./paginationSlice"
export { default as paginationReducer } from "./paginationSlice"
export type { PaginationState } from "./paginationSlice"

export {
  selectCurrentPage,
  selectPageSize,
  makeSelectPaginatedProducts,
} from "./selectors"
