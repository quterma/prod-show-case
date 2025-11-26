// Model exports
export {
  setCurrentPage,
  setPageSize,
  resetCurrentPage,
  paginationReducer,
  selectCurrentPage,
  selectPageSize,
  makeSelectPaginatedProducts,
} from "./model"
export type { PaginationState } from "./model"

// Hooks exports
export { usePagination, type UsePaginationResult } from "./hooks"

// UI exports
export { Pagination } from "./ui"
