import { useEffect, useMemo } from "react"

import type { Product } from "@/entities/product"
import {
  makeSelectPaginatedProducts,
  makeSelectTotalPages,
  setMaxPage,
} from "@/features/pagination"
import { useAppDispatch, useAppSelector } from "@/shared/lib/store"

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
}

/**
 * Hook for managing pagination of products
 *
 * Handles:
 * - Creating memoized pagination selectors
 * - Calculating total pages based on products length
 * - Syncing maxPage in Redux for bounds validation
 * - Returning paginated slice of products
 *
 * @param products - Products array to paginate (after filtering)
 * @returns Pagination result with paginated products and metadata
 *
 * @example
 * ```ts
 * const filteredProducts = useFilteredProducts(data)
 * const { paginatedProducts, totalCount, totalPages } = usePagination(filteredProducts)
 * ```
 */
export function usePagination(
  products: Product[] | undefined
): UsePaginationResult {
  const dispatch = useAppDispatch()

  // Create memoized pagination selectors (stable across re-renders)
  const selectPaginatedProducts = useMemo(
    () => makeSelectPaginatedProducts(),
    []
  )
  const selectTotalPages = useMemo(() => makeSelectTotalPages(), [])

  // Get paginated products and total pages from selectors
  const paginatedProducts = useAppSelector((state) =>
    selectPaginatedProducts(state, products)
  )
  const totalPages = useAppSelector((state) =>
    selectTotalPages(state, products)
  )

  // Sync maxPage with totalPages (for pagination bounds validation)
  useEffect(() => {
    dispatch(setMaxPage(totalPages))
  }, [totalPages, dispatch])

  return {
    paginatedProducts: paginatedProducts ?? [],
    totalCount: products?.length ?? 0,
    totalPages,
  }
}
