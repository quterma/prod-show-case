import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import filtersReducer from "../../model/filtersSlice"

import { QueryFilter } from "./QueryFilter"

function createTestStore() {
  return configureStore({
    reducer: {
      filters: filtersReducer,
    },
  })
}

describe("QueryFilter", () => {
  it("renders search input", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <QueryFilter />
      </Provider>
    )

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
  })

  it("renders with correct initial value from Redux", () => {
    const store = configureStore({
      reducer: {
        filters: filtersReducer,
      },
      preloadedState: {
        filters: {
          searchQuery: "initial",
          categories: [],
          minPrice: null,
          maxPrice: null,
          minRating: null,
          showOnlyFavorites: false,
        },
      },
    })

    render(
      <Provider store={store}>
        <QueryFilter />
      </Provider>
    )

    const input = screen.getByPlaceholderText("Search products...")
    expect(input).toHaveValue("initial")
  })
})
