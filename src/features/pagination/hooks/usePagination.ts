import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { useAppSelector } from "@/shared/lib/store"

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
 * const favorites = useFavoriteProducts(filtered)
 * const pagination = usePagination(favorites)
 * ```
 */
export function usePagination(products: Product[]): UsePaginationResult {
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
    totalPages: result.totalPages,
  }
}
