import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"
import type { RootState } from "@/shared/lib/store"

import {
  selectSearchQuery,
  selectCategories,
  selectMinPrice,
  selectMaxPrice,
  selectMinRating,
  selectHasActiveFilters,
  makeSelectFilteredProducts,
} from "./selectors"

const createMockState = (filters = {}) =>
  ({
    favorites: {
      favoriteIds: [],
    },
    localProducts: {
      localProductsById: {},
      removedApiIds: [],
      nextLocalId: -1,
    },
    filters: {
      searchQuery: "",
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      ...filters,
    },
  }) as unknown as RootState

describe("Filter Selectors", () => {
  describe("Simple selectors", () => {
    it("selectSearchQuery returns search query", () => {
      const state = createMockState({ searchQuery: "test" })
      expect(selectSearchQuery(state)).toBe("test")
    })

    it("selectCategories returns categories array", () => {
      const state = createMockState({ categories: ["electronics"] })
      expect(selectCategories(state)).toEqual(["electronics"])
    })

    it("selectMinPrice returns min price", () => {
      const state = createMockState({ minPrice: 10 })
      expect(selectMinPrice(state)).toBe(10)
    })

    it("selectMaxPrice returns max price", () => {
      const state = createMockState({ maxPrice: 100 })
      expect(selectMaxPrice(state)).toBe(100)
    })

    it("selectMinRating returns min rating", () => {
      const state = createMockState({ minRating: 4 })
      expect(selectMinRating(state)).toBe(4)
    })
  })

  describe("selectHasActiveFilters", () => {
    it("returns false when no filters active", () => {
      const state = createMockState()
      expect(selectHasActiveFilters(state)).toBe(false)
    })

    it("returns true when search query is set", () => {
      const state = createMockState({ searchQuery: "test" })
      expect(selectHasActiveFilters(state)).toBe(true)
    })

    it("returns true when categories selected", () => {
      const state = createMockState({ categories: ["electronics"] })
      expect(selectHasActiveFilters(state)).toBe(true)
    })

    it("returns true when price filters set", () => {
      const state = createMockState({ minPrice: 10 })
      expect(selectHasActiveFilters(state)).toBe(true)
    })

    it("returns true when rating filter set", () => {
      const state = createMockState({ minRating: 4 })
      expect(selectHasActiveFilters(state)).toBe(true)
    })
  })

  describe("makeSelectFilteredProducts", () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: "iPhone",
        price: 999,
        category: "electronics",
        description: "Smartphone",
        image: "img.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: 2,
        title: "Shoes",
        price: 50,
        category: "clothing",
        description: "Running shoes",
        image: "img.jpg",
        rating: { rate: 3.5, count: 50 },
      },
    ]

    it("returns undefined when products is undefined", () => {
      const state = createMockState()
      const selector = makeSelectFilteredProducts()

      expect(selector(state, undefined)).toBeUndefined()
    })

    it("returns all products when no filters active", () => {
      const state = createMockState()
      const selector = makeSelectFilteredProducts()

      expect(selector(state, mockProducts)).toEqual(mockProducts)
    })

    it("filters by search query", () => {
      const state = createMockState({ searchQuery: "iphone" })
      const selector = makeSelectFilteredProducts()

      const result = selector(state, mockProducts)
      expect(result).toHaveLength(1)
      expect(result?.[0].title).toBe("iPhone")
    })

    it("filters by category", () => {
      const state = createMockState({ categories: ["electronics"] })
      const selector = makeSelectFilteredProducts()

      const result = selector(state, mockProducts)
      expect(result).toHaveLength(1)
      expect(result?.[0].category).toBe("electronics")
    })

    it("filters by min rating", () => {
      const state = createMockState({ minRating: 4 })
      const selector = makeSelectFilteredProducts()

      const result = selector(state, mockProducts)
      expect(result).toHaveLength(1)
      expect(result?.[0].rating.rate).toBeGreaterThanOrEqual(4)
    })
  })
})
