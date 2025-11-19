import { configureStore } from "@reduxjs/toolkit"
import { describe, expect, it, vi } from "vitest"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import filtersReducer from "@/features/filters/model/filtersSlice"
import localProductsReducer from "@/features/local-products/model/localProductsSlice"
import { baseApi } from "@/shared/api/baseApi"

import { resetLocalData } from "./resetLocalDataThunk"

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
})

describe("resetLocalData thunk", () => {
  it("should reset favorites, local products, and filters state", () => {
    // Setup store with some initial data
    const store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        localProducts: localProductsReducer,
        filters: filtersReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
      preloadedState: {
        favorites: {
          favoriteIds: ["1", "2", "3"],
          showOnlyFavorites: true,
        },
        localProducts: {
          localProductsById: {
            local_test123: {
              id: "local_test123",
              title: "Local Product",
              price: 99.99,
              description: "Test",
              category: "test",
              image: "test.jpg",
              rating: { rate: 0, count: 0 },
            },
          },
          removedProductIds: ["4", "5"],
        },
        filters: {
          searchQuery: "test",
          categories: ["electronics"],
          minPrice: 10,
          maxPrice: 100,
          minRating: 4,
        },
      },
    })

    // Set localStorage
    mockLocalStorage.setItem(
      "prod-showcase:favorites",
      JSON.stringify([1, 2, 3])
    )

    // Dispatch resetLocalData
    // @ts-expect-error - thunk dispatch type mismatch in tests
    store.dispatch(resetLocalData())

    // Check state was reset
    const state = store.getState()

    expect(state.favorites.favoriteIds).toEqual([])
    expect(state.favorites.showOnlyFavorites).toBe(false)
    expect(state.localProducts.localProductsById).toEqual({})
    expect(state.localProducts.removedProductIds).toEqual([])
    expect(state.filters).toEqual({
      searchQuery: "",
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
    })

    // Note: localStorage persistence is handled by persistMiddleware
    // which is not included in this unit test (tested separately in integration tests)
  })

  it("should invalidate RTK Query cache", () => {
    const store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        localProducts: localProductsReducer,
        filters: filtersReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    })

    // Spy on invalidateTags
    const invalidateTagsSpy = vi.spyOn(baseApi.util, "invalidateTags")

    // Dispatch resetLocalData
    // @ts-expect-error - thunk dispatch type mismatch in tests
    store.dispatch(resetLocalData())

    // Check invalidateTags was called
    expect(invalidateTagsSpy).toHaveBeenCalledWith(["Product"])
  })
})
