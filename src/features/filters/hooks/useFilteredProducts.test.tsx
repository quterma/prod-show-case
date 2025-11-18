import { configureStore } from "@reduxjs/toolkit"
import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"
import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import { localProductsReducer } from "@/features/local-products"
import paginationReducer, {
  PAGE_SIZE,
} from "@/features/pagination/model/paginationSlice"

import filtersReducer from "../model/filtersSlice"

import { useFilteredProducts } from "./useFilteredProducts"

function createTestStore(initialState = {}) {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
      localProducts: localProductsReducer,
      filters: filtersReducer,
      pagination: paginationReducer,
    },
    preloadedState: {
      favorites: {
        favoriteIds: [],
        showOnlyFavorites: false,
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
        showOnlyFavorites: false,
        ...initialState,
      },
      pagination: {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        maxPage: null,
      },
    },
  })
}

function createWrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }
}

describe("useFilteredProducts", () => {
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

  it("returns empty array when products is empty", () => {
    const store = createTestStore()
    const { result } = renderHook(() => useFilteredProducts([]), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toEqual([])
  })

  it("returns all products when no filters active", () => {
    const store = createTestStore()
    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toEqual(mockProducts)
  })

  it("filters by search query", () => {
    const store = createTestStore({ searchQuery: "iphone" })
    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toHaveLength(1)
    expect(result.current?.[0].title).toBe("iPhone")
  })

  it("filters by category", () => {
    const store = createTestStore({ categories: ["electronics"] })
    const { result } = renderHook(() => useFilteredProducts(mockProducts), {
      wrapper: createWrapper(store),
    })

    expect(result.current).toHaveLength(1)
    expect(result.current?.[0].category).toBe("electronics")
  })
})
