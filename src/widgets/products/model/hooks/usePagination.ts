import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { makeSelectPaginatedProducts } from "@/features/pagination"
import { useAppSelector } from "@/shared/lib/store"

/**
 * Result interface for usePagination hook
 */
export interface UsePaginationResult {
  /** Paginated slice of products for current page */
  paginatedProducts: Product[]
  /** Total number of products before pagination */
  totalCount: number
  /** Total number of pages */
  totalPages: number
  /** Range start (1-based index of first item on page) */
  rangeStart: number
  /** Range end (1-based index of last item on page) */
  rangeEnd: number
  /** Current page number */
  currentPage: number
  /** Items per page */
  pageSize: number
}

/**
 * Hook for managing pagination of products
 *
 * Handles:
 * - Creating memoized pagination selector
 * - Calculating pagination metadata (total pages, ranges, etc.)
 * - Returning paginated slice of products
 *
 * NOTE: This hook expects pre-processed products (already filtered/merged).
 * It only handles pagination logic - slicing the array into pages.
 *
 * @param products - Products array to paginate (after all filters applied)
 * @returns Pagination result with paginated products and metadata
 *
 * @example
 * ```ts
 * // In widget: apply all filters first, then paginate
 * const merged = useMergedProducts(apiProducts)
 * const filtered = useFilteredProducts(merged)
 * const favoritesFiltered = useFavoritesFilter(filtered)
 * const pagination = usePagination(favoritesFiltered)
 * ```
 */
export function usePagination(
  products: Product[] | undefined
): UsePaginationResult {
  // Create memoized pagination selector (stable across re-renders)
  const selectPaginatedProducts = useMemo(
    () => makeSelectPaginatedProducts(),
    []
  )

  // Get pagination result from selector
  const result = useAppSelector((state) =>
    selectPaginatedProducts(state, products)
  )

  return {
    paginatedProducts: result.items,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    rangeStart: result.rangeStart,
    rangeEnd: result.rangeEnd,
    currentPage: result.currentPage,
    pageSize: result.pageSize,
  }
}
