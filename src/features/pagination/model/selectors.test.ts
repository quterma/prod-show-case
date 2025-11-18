import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product"
import type { RootState } from "@/shared/lib/store"

import {
  selectCurrentPage,
  selectPageSize,
  makeSelectPaginatedProducts,
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

// Helper to create mock state (simplified - only pagination state needed)
const createMockState = (
  currentPage: number,
  pageSize: number
): Partial<RootState> => ({
  pagination: {
    currentPage,
    pageSize,
  },
  filters: {
    searchQuery: "",
    categories: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
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

  describe("makeSelectPaginatedProducts", () => {
    it("returns first page of products", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result.items).toHaveLength(10)
      expect(result.items[0].id).toBe(1)
      expect(result.items[9].id).toBe(10)
      expect(result.totalPages).toBe(3)
    })

    it("returns second page of products", () => {
      const state = createMockState(2, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result.items).toHaveLength(10)
      expect(result.items[0].id).toBe(11)
      expect(result.items[9].id).toBe(20)
      expect(result.totalPages).toBe(3)
    })

    it("returns partial last page when products do not fill page", () => {
      const state = createMockState(3, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result.items).toHaveLength(5)
      expect(result.items[0].id).toBe(21)
      expect(result.items[4].id).toBe(25)
      expect(result.totalPages).toBe(3)
    })

    it("clamps page to valid range when page exceeds total pages", () => {
      const state = createMockState(10, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result.items).toHaveLength(5)
      expect(result.totalPages).toBe(3)
    })

    it("returns empty result when products array is empty", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, [])

      expect(result.items).toEqual([])
      expect(result.totalPages).toBe(0)
    })

    it("returns empty result when products is undefined", () => {
      const state = createMockState(1, 10) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, undefined)

      expect(result.items).toEqual([])
      expect(result.totalPages).toBe(0)
    })

    it("handles page size of 1 correctly", () => {
      const state = createMockState(5, 1) as RootState
      const selectPaginatedProducts = makeSelectPaginatedProducts()

      const result = selectPaginatedProducts(state, mockProducts)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe(5)
      expect(result.totalPages).toBe(25)
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
      expect(result1.items[0].id).toBe(1)
      expect(result2.items[0].id).toBe(11)
    })
  })
})
