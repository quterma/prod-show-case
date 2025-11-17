import { createSelector } from "@reduxjs/toolkit"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

/**
 * Simple selectors for pagination state
 */
export const selectCurrentPage = (state: RootState) =>
  state.pagination.currentPage
export const selectPageSize = (state: RootState) => state.pagination.pageSize

/**
 * Factory selector for paginated products
 * Accepts already filtered/merged products array and returns slice for current page
 *
 * NOTE: This selector is pure pagination logic - it doesn't know about filters or favorites.
 * The products array should be pre-processed by the widget layer.
 *
 * @returns Object with paginated items and metadata
 */
export const makeSelectPaginatedProducts = () =>
  createSelector(
    [
      (_state: RootState, products: Product[] | undefined) => products,
      selectCurrentPage,
      selectPageSize,
    ],
    (products, currentPage, pageSize) => {
      if (!products || products.length === 0) {
        return {
          items: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize,
          rangeStart: 0,
          rangeEnd: 0,
        }
      }

      const totalCount = products.length
      const totalPages = Math.ceil(totalCount / pageSize)

      // Clamp currentPage to valid range
      const validPage = Math.max(1, Math.min(currentPage, totalPages))

      const start = (validPage - 1) * pageSize
      const end = start + pageSize
      const items = products.slice(start, end)

      const rangeStart = totalCount > 0 ? start + 1 : 0
      const rangeEnd = Math.min(end, totalCount)

      return {
        items,
        totalCount,
        totalPages,
        currentPage: validPage,
        pageSize,
        rangeStart,
        rangeEnd,
      }
    }
  )
