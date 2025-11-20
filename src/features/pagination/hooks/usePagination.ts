import { useEffect, useMemo } from "react"

import type { Product } from "@/entities/product"
import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

import { setPage } from "../model/paginationSlice"
import { makeSelectPaginatedProducts } from "../model/selectors"

/**
 * Result interface for usePagination hook
 */
export interface UsePaginationResult {
  /** Paginated slice of products for current page */
  paginatedProducts: Product[]
  /** Total number of pages */
  totalPages: number
}

/**
 * Hook for managing pagination of products
 *
 * Handles:
 * - Creating memoized pagination selector
 * - Calculating pagination metadata (total pages, ranges, etc.)
 * - Returning paginated slice of products
 * - Auto-correcting currentPage when it exceeds totalPages
 *
 * NOTE: This hook expects pre-processed products (already filtered/merged).
 * It only handles pagination logic - slicing the array into pages.
 *
 * Auto-correction logic:
 * When totalPages decreases (due to deletion, filters, etc.) and currentPage
 * becomes invalid, the hook automatically resets to the last valid page.
 * This ensures pagination state is always consistent.
 *
 * @param products - Products array to paginate (after all filters applied)
 * @returns Pagination result with paginated products and metadata
 *
 * @example
 * ```ts
 * // In widget: apply all filters first, then paginate
 * const merged = useMergedProducts(apiProducts)
 * const filtered = useFilteredProducts(merged)
 * const favorites = useFavoriteProducts(filtered)
 * const pagination = usePagination(favorites)
 * // Auto-correction happens automatically inside usePagination
 * ```
 */
export function usePagination(products: Product[]): UsePaginationResult {
  const dispatch = useAppDispatch()

  // Create memoized pagination selector (stable across re-renders)
  const selectPaginatedProducts = useMemo(
    () => makeSelectPaginatedProducts(),
    []
  )

  // Get pagination result from selector
  const result = useAppSelector((state) =>
    selectPaginatedProducts(state, products)
  )

  const currentPage = useAppSelector((state) => state.pagination.currentPage)

  // Auto-correct currentPage when it exceeds totalPages
  // This happens when:
  // - Products are deleted (totalPages decreases)
  // - Filters are applied (totalPages decreases)
  // - Local changes are made
  useEffect(() => {
    const { totalPages } = result

    // Only correct if:
    // 1. We have data (totalPages > 0)
    // 2. Current page is out of bounds
    if (totalPages > 0 && currentPage > totalPages) {
      dispatch(setPage(totalPages))
    }
  }, [dispatch, currentPage, result])

  return {
    paginatedProducts: result.items,
    totalPages: result.totalPages,
  }
}
