// Model exports
export {
  PAGE_SIZE,
  setPage,
  setPageSize,
  resetPage,
  paginationReducer,
  selectCurrentPage,
  selectPageSize,
  makeSelectPaginatedProducts,
} from "./model"
export type { PaginationState } from "./model"

// UI exports
export { Pagination } from "./ui"
