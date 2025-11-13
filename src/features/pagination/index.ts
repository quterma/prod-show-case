// Model exports
export {
  PAGE_SIZE,
  setPage,
  setMaxPage,
  setPageSize,
  resetPage,
  paginationReducer,
  selectCurrentPage,
  selectPageSize,
  makeSelectTotalPages,
  makeSelectPaginatedProducts,
  makeSelectPaginationMeta,
} from "./model"
export type { PaginationState } from "./model"

// UI exports
export { Pagination } from "./ui"
