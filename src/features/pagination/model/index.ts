export {
  PAGE_SIZE,
  setPage,
  setMaxPage,
  setPageSize,
  resetPage,
} from "./paginationSlice"
export { default as paginationReducer } from "./paginationSlice"
export type { PaginationState } from "./paginationSlice"

export {
  selectCurrentPage,
  selectPageSize,
  makeSelectTotalPages,
  makeSelectPaginatedProducts,
  makeSelectPaginationMeta,
} from "./selectors"
