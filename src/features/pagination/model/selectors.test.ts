import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

import {
  selectCurrentPage,
  selectPageSize,
  makeSelectTotalPages,
  makeSelectPaginatedProducts,
  makeSelectPaginationMeta,
} from "./selectors"

// Mock products for testing
const createMockProduct = (id: number): Product => ({
  id,
  title: `Product ${id}`,
  price: id * 10,
  description: `Description ${id}`,
  category: "electronics",
  image: `https://example.com/${id}.jpg`,
  rating: { rate: 4.5, count: 100 },
})

const mockProducts: Product[] = Array.from({ length: 25 }, (_, i) =>
  createMockProduct(i + 1)
)

// Helper to create mock state (needs filters for makeSelectFilteredProducts dependency)
const createMockState = (
  currentPage: number,
  pageSize: number
): Partial<RootState> => ({
  favorites: {
    favoriteIds: [],
  },
  removed: {
    removedIds: [],
  },
  pagination: {
    currentPage,
    pageSize,
    maxPage: null,
  },
  filters: {
    searchQuery: "",
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    showOnlyFavorites: false,
  },
})

describe("pagination selectors", () => {
  describe("selectCurrentPage", () => {
    it("returns current page from state", () => {
      const state = createMockState(3, 10) as RootState

      expect(selectCurrentPage(state)).toBe(3)
    })
  })

  describe("selectPageSize", () => {
    it("returns page size from state", () => {
      const state = createMockState(1, 20) as RootState

      expect(selectPageSize(state)).toBe(20)
    })
  })

  describe("makeSelectTotalPages", () => {
    it("calculates total pages correctly for products evenly divisible by page size", () => {
      const state = createMockState(1, 5) as RootState
      const selectTotalPages = makeSelectTotalPages()

      // 25 products / 5 per page = 5 pages
      expect(selectTotalPages(state, mockProducts)).toBe(5)
    })

    it("calculates total pages correctly with remainder", () => {
      const state = createMockState(1, 10) as RootState
      const selectTotalPages = makeSelectTotalPages()

      // 25 products / 10 per page = 3 pages (ceiling)
      expect(selectTotalPages(state, mockProducts)).toBe(3)
    })

    it("returns 1 page when products length equals page size", () => {
      const state = createMockState(1, 25) as RootState
      const selectTotalPages = makeSelectTotalPages()

      expect(selectTotalPages(state, mockProducts)).toBe(1)
    })

    it("returns 0 pages when products array is empty", () => {
      const state = createMockState(1, 10) as RootState
      const selectTotalPages = makeSelectTotalPages()

      expect(selectTotalPages(state, [])).toBe(0)
    })

    it("returns 0 pages when products is undefined", () => {
      const state = createMockState(1, 10) as RootState
      const selectTotalPages = makeSelectTotalPages()

      expect(selectTotalPages(state, undefined)).toBe(0)
    })

    it("handles large page sizes correctly", () => {
      const state = createMockState(1, 100) as RootState
      const selectTotalPages = makeSelectTotalPages()

      // 25 products / 100 per page = 1 page (ceiling)
      expect(selectTotalPages(state, mockProducts)).toBe(1)
    })
  })

  describe("makeSelectPaginatedProducts", () => {
    it("returns first page of products", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result).toHaveLength(10)
      expect(result?.[0].id).toBe(1)
      expect(result?.[9].id).toBe(10)
    })

    it("returns second page of products", () => {
      const state = createMockState(2, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result).toHaveLength(10)
      expect(result?.[0].id).toBe(11)
      expect(result?.[9].id).toBe(20)
    })

    it("returns partial last page when products do not fill page", () => {
      const state = createMockState(3, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      // Page 3: products 21-25 (only 5 products)
      expect(result).toHaveLength(5)
      expect(result?.[0].id).toBe(21)
      expect(result?.[4].id).toBe(25)
    })

    it("returns empty array when page exceeds total pages", () => {
      const state = createMockState(10, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      // Page 10 with 10 per page = products 91-100, but we only have 25 products
      expect(result).toEqual([])
    })

    it("returns undefined when products array is empty", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, [])

      expect(result).toBeUndefined()
    })

    it("returns undefined when products is undefined", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, undefined)

      expect(result).toBeUndefined()
    })

    it("handles page size of 1 correctly", () => {
      const state = createMockState(5, 1) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result).toHaveLength(1)
      expect(result?.[0].id).toBe(5)
    })
  })

  describe("makeSelectPaginationMeta", () => {
    it("returns correct metadata for first page", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginationMeta = makeSelectPaginationMeta()

      const meta = selectPaginationMeta(state, mockProducts)

      expect(meta).toEqual({
        totalCount: 25,
        totalPages: 3,
        rangeStart: 1,
        rangeEnd: 10,
        currentPage: 1,
        pageSize: 10,
      })
    })

    it("returns correct metadata for middle page", () => {
      const state = createMockState(2, 10) as RootState
      const selectPaginationMeta = makeSelectPaginationMeta()

      const meta = selectPaginationMeta(state, mockProducts)

      expect(meta).toEqual({
        totalCount: 25,
        totalPages: 3,
        rangeStart: 11,
        rangeEnd: 20,
        currentPage: 2,
        pageSize: 10,
      })
    })

    it("returns correct metadata for last partial page", () => {
      const state = createMockState(3, 10) as RootState
      const selectPaginationMeta = makeSelectPaginationMeta()

      const meta = selectPaginationMeta(state, mockProducts)

      expect(meta).toEqual({
        totalCount: 25,
        totalPages: 3,
        rangeStart: 21,
        rangeEnd: 25, // Only 5 products on last page
        currentPage: 3,
        pageSize: 10,
      })
    })

    it("returns correct metadata when empty", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginationMeta = makeSelectPaginationMeta()

      const meta = selectPaginationMeta(state, [])

      expect(meta).toEqual({
        totalCount: 0,
        totalPages: 0,
        rangeStart: 0,
        rangeEnd: 0,
        currentPage: 1,
        pageSize: 10,
      })
    })

    it("returns correct metadata when products is undefined", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginationMeta = makeSelectPaginationMeta()

      const meta = selectPaginationMeta(state, undefined)

      expect(meta).toEqual({
        totalCount: 0,
        totalPages: 0,
        rangeStart: 0,
        rangeEnd: 0,
        currentPage: 1,
        pageSize: 10,
      })
    })
  })

  describe("selector memoization", () => {
    it("creates independent selector instances", () => {
      const selector1 = makeSelectPaginatedProducts()
      const selector2 = makeSelectPaginatedProducts()

      expect(selector1).not.toBe(selector2) // Different instances
    })

    it("memoizes results when inputs do not change", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result1 = selectPaginatedProducts(state, mockProducts)
      const result2 = selectPaginatedProducts(state, mockProducts)

      expect(result1).toBe(result2) // Same reference (memoized)
    })

    it("recomputes when page changes", () => {
      const state1 = createMockState(1, 10) as RootState
      const state2 = createMockState(2, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result1 = selectPaginatedProducts(state1, mockProducts)
      const result2 = selectPaginatedProducts(state2, mockProducts)

      expect(result1).not.toBe(result2) // Different references
      expect(result1?.[0].id).toBe(1)
      expect(result2?.[0].id).toBe(11)
    })
  })
})
