import type { EnhancedStore } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import type { Product } from "@/entities/product/model"
import { baseApi } from "@/shared/api/baseApi"

import filtersReducer, { setSearchQuery, resetFilters } from "./filtersSlice"
import { useProductFilters } from "./useProductFilters"

// Test wrapper with Redux Provider
function createWrapper(): {
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element
  store: EnhancedStore
} {
  const store = configureStore({
    reducer: {
      filters: filtersReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })

  const WrapperComponent = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  WrapperComponent.displayName = "TestWrapper"

  return { wrapper: WrapperComponent, store }
}

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
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useProductFilters(mockProducts), {
      wrapper,
    })

    expect(result.current.filteredProducts).toEqual(mockProducts)
    expect(result.current.hasActiveFilters).toBe(false)
  })

  it("filters by search with debounce (integration with Redux)", () => {
    const { wrapper, store } = createWrapper()

    const { result } = renderHook(() => useProductFilters(mockProducts), {
      wrapper,
    })

    // Dispatch search action
    act(() => {
      store.dispatch(setSearchQuery("iphone"))
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
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useProductFilters(undefined), {
      wrapper,
    })

    expect(result.current.filteredProducts).toEqual([])
  })

  it("filters by multiple categories", () => {
    const { wrapper, store } = createWrapper()

    const { result } = renderHook(() => useProductFilters(mockProducts), {
      wrapper,
    })

    // Set categories filter
    act(() => {
      store.dispatch({
        type: "filters/setCategories",
        payload: ["electronics"],
      })
    })

    expect(result.current.filteredProducts).toHaveLength(2)
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it("filters by minimum rating", () => {
    const { wrapper, store } = createWrapper()

    const { result } = renderHook(() => useProductFilters(mockProducts), {
      wrapper,
    })

    // Set min rating filter
    act(() => {
      store.dispatch({ type: "filters/setMinRating", payload: 4.6 })
    })

    expect(result.current.filteredProducts).toHaveLength(1)
    expect(result.current.filteredProducts[0].title).toBe("iPhone 14 Pro")
    expect(result.current.hasActiveFilters).toBe(true)
  })

  it("resets all filters", () => {
    const { wrapper, store } = createWrapper()

    const { result } = renderHook(() => useProductFilters(mockProducts), {
      wrapper,
    })

    // Set search filter
    act(() => {
      store.dispatch(setSearchQuery("test"))
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.hasActiveFilters).toBe(true)

    // Reset filters
    act(() => {
      store.dispatch(resetFilters())
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.filteredProducts).toEqual(mockProducts)
  })
})
