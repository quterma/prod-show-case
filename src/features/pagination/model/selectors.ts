import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
//TODO: fix circular dependency
import { makeSelectFilteredProducts } from "@/features/filters"
import type { RootState } from "@/shared/lib/store"

/**
 * Simple selectors for pagination state
 */
export const selectCurrentPage = (state: RootState) =>
  state.pagination.currentPage
export const selectPageSize = (state: RootState) => state.pagination.pageSize

/**
 * Factory selector for total pages calculation
 * Accepts products as parameter (can be raw or filtered products)
 */
export const makeSelectTotalPages = () => {
  // Create filtered products selector instance once
  //TODO: fix circular dependency
  const selectFilteredProducts = makeSelectFilteredProducts()

  return createSelector(
    [
      (_state: RootState, products: Product[] | undefined) => products,
      (state: RootState, products: Product[] | undefined) =>
        selectFilteredProducts(state, products),
      selectPageSize,
    ],
    (_products, filtered, pageSize) => {
      const count = filtered?.length ?? 0
      return Math.ceil(count / pageSize)
    }
  )
}

/**
 * Factory selector for paginated products slice
 * Returns products for current page only
 */
export const makeSelectPaginatedProducts = () => {
  // Create filtered products selector instance once
  const selectFilteredProducts = makeSelectFilteredProducts()

  return createSelector(
    [
      (_state: RootState, products: Product[] | undefined) => products,
      (state: RootState, products: Product[] | undefined) =>
        selectFilteredProducts(state, products),
      selectCurrentPage,
      selectPageSize,
    ],
    (_products, filtered, currentPage, pageSize) => {
      if (!filtered || filtered.length === 0) return undefined

      const start = (currentPage - 1) * pageSize
      const end = start + pageSize

      return filtered.slice(start, end)
    }
  )
}

/**
 * Factory selector for pagination metadata
 * Returns all pagination info for UI display
 */
export const makeSelectPaginationMeta = () => {
  // Create selector instances once
  const selectFilteredProducts = makeSelectFilteredProducts()
  const selectTotalPages = makeSelectTotalPages()

  return createSelector(
    [
      (_state: RootState, products: Product[] | undefined) => products,
      (state: RootState, products: Product[] | undefined) =>
        selectFilteredProducts(state, products),
      selectCurrentPage,
      selectPageSize,
      (state: RootState, products: Product[] | undefined) =>
        selectTotalPages(state, products),
    ],
    (_products, filtered, currentPage, pageSize, totalPages) => {
      const totalCount = filtered?.length ?? 0
      const rangeStart = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0
      const rangeEnd = Math.min(currentPage * pageSize, totalCount)

      return {
        totalCount,
        totalPages,
        rangeStart,
        rangeEnd,
        currentPage,
        pageSize,
      }
    }
  )
}
