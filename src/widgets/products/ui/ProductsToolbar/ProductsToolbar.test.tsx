import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import filtersReducer from "@/features/filters/model/filtersSlice"
import { localProductsReducer } from "@/features/local-products"
import paginationReducer, {
  PAGE_SIZE,
} from "@/features/pagination/model/paginationSlice"
import { baseApi } from "@/shared/api/baseApi"

import { ProductsToolbar } from "./ProductsToolbar"

// Helper to create test store
function createTestStore(initialFilters = {}) {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
      localProducts: localProductsReducer,
      filters: filtersReducer,
      pagination: paginationReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    preloadedState: {
      favorites: {
        favoriteIds: [],
        showOnlyFavorites: false,
      },
      localProducts: {
        localProductsById: {},
        removedProductIds: [],
      },
      filters: {
        searchQuery: "",
        categories: [],
        minPrice: null,
        maxPrice: null,
        minRating: null,
        ...initialFilters,
      },
      pagination: {
        currentPage: 1,
        pageSize: PAGE_SIZE,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

describe("ProductsToolbar", () => {
  const mockPriceRange = { min: 10, max: 100 }

  it("renders search input", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} priceRange={undefined} />
      </Provider>
    )

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
  })

  it("renders category filters when categories provided", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar
          categories={["electronics", "clothing"]}
          priceRange={undefined}
        />
      </Provider>
    )

    expect(screen.getByText(/electronics/i)).toBeInTheDocument()
    expect(screen.getByText(/clothing/i)).toBeInTheDocument()
  })

  it("renders price range filter when priceRange provided", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} priceRange={mockPriceRange} />
      </Provider>
    )

    expect(screen.getByPlaceholderText(/min/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/max/i)).toBeInTheDocument()
  })

  it("renders rating filter", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} priceRange={undefined} />
      </Provider>
    )

    expect(screen.getByText(/rating:/i)).toBeInTheDocument()
  })

  it("renders reset button as disabled when no active filters", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} priceRange={undefined} />
      </Provider>
    )

    const resetButton = screen.getByRole("button", { name: /reset filters/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).toBeDisabled()
  })

  it("renders reset button as enabled when filters are active", () => {
    const store = createTestStore({ searchQuery: "test" })

    render(
      <Provider store={store}>
        <ProductsToolbar categories={[]} priceRange={undefined} />
      </Provider>
    )

    const resetButton = screen.getByRole("button", { name: /reset filters/i })
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).not.toBeDisabled()
  })
})
