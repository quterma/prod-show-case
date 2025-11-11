import { act, renderHook } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import type { Product } from "@/entities/product/model"

import { useProductFilters } from "./useProductFilters"

describe("useProductFilters", () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: "iPhone 14 Pro",
      price: 999,
      category: "electronics",
      description: "Latest Apple smartphone",
      image: "img1.jpg",
      rating: { rate: 4.8, count: 200 },
    },
    {
      id: 2,
      title: "Samsung Galaxy S23",
      price: 899,
      category: "electronics",
      description: "Powerful Android phone",
      image: "img2.jpg",
      rating: { rate: 4.5, count: 150 },
    },
    {
      id: 3,
      title: "Nike Air Max",
      price: 120,
      category: "clothing",
      description: "Comfortable running shoes",
      image: "img3.jpg",
      rating: { rate: 4.2, count: 80 },
    },
  ]

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it("returns all products when no filters applied", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts))

    expect(result.current.filteredProducts).toEqual(mockProducts)
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it("filters by search with debounce", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts))

    act(() => {
      result.current.setters.setSearch("iphone")
    })

    // Should not filter immediately (debounced)
    expect(result.current.filteredProducts).toEqual(mockProducts)

    // Fast-forward debounce delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should filter now
    expect(result.current.filteredProducts).toHaveLength(1)
    expect(result.current.filteredProducts[0].title).toBe("iPhone 14 Pro")
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it("returns empty array when products is undefined", () => {
    const { result } = renderHook(() => useProductFilters(undefined))

    expect(result.current.filteredProducts).toEqual([])
  })

  it("exposes filter state", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts))

    expect(result.current.filters).toEqual({
      search: "",
      category: null,
      showOnlyFavorites: false,
      minPrice: null,
      maxPrice: null,
    })
  })

  it("updates search state immediately", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts))

    act(() => {
      result.current.setters.setSearch("test")
    })

    expect(result.current.filters.search).toBe("test")
  })

  it("resets all filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts))

    act(() => {
      result.current.setters.setSearch("test")
      result.current.setters.setCategory("electronics")
    })

    // Verify filters are active
    expect(result.current.filters.search).toBe("test")
    expect(result.current.filters.category).toBe("electronics")

    act(() => {
      result.current.setters.resetFilters()
    })

    expect(result.current.filters).toEqual({
      search: "",
      category: null,
      showOnlyFavorites: false,
      minPrice: null,
      maxPrice: null,
    })
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it("hasActiveFilters reflects filter state correctly", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts))

    // Initially no filters
    expect(result.current.hasActiveFilters).toBe(false)

    // Set search (but not debounced yet)
    act(() => {
      result.current.setters.setSearch("test")
    })
    expect(result.current.hasActiveFilters).toBe(false)

    // After debounce
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.hasActiveFilters).toBe(true)

    // Set category
    act(() => {
      result.current.setters.setSearch("")
      result.current.setters.setCategory("electronics")
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current.hasActiveFilters).toBe(true)

    // Set showOnlyFavorites
    act(() => {
      result.current.setters.setCategory(null)
      result.current.setters.setShowOnlyFavorites(true)
    })
    expect(result.current.hasActiveFilters).toBe(true)

    // Set price filters
    act(() => {
      result.current.setters.setShowOnlyFavorites(false)
      result.current.setters.setMinPrice(100)
    })
    expect(result.current.hasActiveFilters).toBe(true)

    // Reset all
    act(() => {
      result.current.setters.resetFilters()
    })
    expect(result.current.hasActiveFilters).toBe(false)
  })
})
