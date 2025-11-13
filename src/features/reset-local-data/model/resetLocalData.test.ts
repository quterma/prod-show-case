import { configureStore } from "@reduxjs/toolkit"
import { describe, expect, it, vi } from "vitest"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import filtersReducer from "@/features/filters/model/filtersSlice"
import removedReducer from "@/features/remove-product/model/removedSlice"
import { baseApi } from "@/shared/api/baseApi"

import { resetLocalData } from "./resetLocalData"

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
  it("should reset favorites, removed, and filters state", () => {
    // Setup store with some initial data
    const store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        removed: removedReducer,
        filters: filtersReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
      preloadedState: {
        favorites: {
          favoriteIds: [1, 2, 3],
        },
        removed: {
          removedIds: [4, 5],
        },
        filters: {
          searchQuery: "test",
          categories: ["electronics"],
          minPrice: 10,
          maxPrice: 100,
          minRating: 4,
          showOnlyFavorites: true,
        },
      },
    })

    // Set localStorage
    mockLocalStorage.setItem(
      "prod-showcase:favorites",
      JSON.stringify([1, 2, 3])
    )
    mockLocalStorage.setItem("prod-showcase:removed", JSON.stringify([4, 5]))

    // Dispatch resetLocalData
    // @ts-expect-error - thunk dispatch type mismatch in tests
    store.dispatch(resetLocalData())

    // Check state was reset
    const state = store.getState()

    expect(state.favorites.favoriteIds).toEqual([])
    expect(state.removed.removedIds).toEqual([])
    expect(state.filters).toEqual({
      searchQuery: "",
      categories: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      showOnlyFavorites: false,
    })

    // Check localStorage was cleared
    expect(mockLocalStorage.getItem("prod-showcase:favorites")).toBe("[]")
    expect(mockLocalStorage.getItem("prod-showcase:removed")).toBe("[]")
  })

  it("should invalidate RTK Query cache", () => {
    const store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        removed: removedReducer,
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
