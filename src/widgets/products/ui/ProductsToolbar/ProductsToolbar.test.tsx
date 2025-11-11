import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import filtersReducer from "@/features/filters/model/filtersSlice"
import { baseApi } from "@/shared/api/baseApi"

import { ProductsToolbar } from "./ProductsToolbar"

// Helper to create test store
function createTestStore(initialFilters = {}) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    preloadedState: {
      filters: {
        search: "",
        categories: [],
        minPrice: null,
        maxPrice: null,
        minRating: null,
        showOnlyFavorites: false,
        ...initialFilters,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

describe("ProductsToolbar", () => {
  it("renders search input", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} hasActiveFilters={false} />
      </Provider>
    )

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
  })

  it("renders categories when provided", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar
          categories={["electronics", "clothing"]}
          hasActiveFilters={false}
        />
      </Provider>
    )

    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
    expect(screen.getByText(/clothing/i)).toBeInTheDocument()
  })

  it("renders reset button as disabled when no active filters", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} hasActiveFilters={false} />
      </Provider>
    )

    const resetButton = screen.getByRole("button", { name: /reset filters/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).toBeDisabled()
  })

  it("renders reset button as enabled when filters are active", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} hasActiveFilters={true} />
      </Provider>
    )

    const resetButton = screen.getByRole("button", { name: /reset filters/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).not.toBeDisabled()
  })
})
