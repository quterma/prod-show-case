import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import filtersReducer from "../../model/filtersSlice"

import { ResetFiltersButton } from "./ResetFiltersButton"

function createTestStore(initialState = {}) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
    },
    preloadedState: {
      filters: {
        searchQuery: "",
        categories: [],
        minPrice: null,
        maxPrice: null,
        minRating: null,
        showOnlyFavorites: false,
        ...initialState,
      },
    },
  })
}

describe("ResetFiltersButton", () => {
  it("renders reset button", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ResetFiltersButton />
      </Provider>
    )

    expect(
      screen.getByRole("button", { name: /reset filters/i })
    ).toBeInTheDocument()
  })

  it("is disabled when no active filters", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <ResetFiltersButton />
      </Provider>
    )

    const button = screen.getByRole("button", { name: /reset filters/i })
    expect(button).toBeDisabled()
  })

  it("is enabled when filters are active", () => {
    const store = createTestStore({ searchQuery: "test" })

    render(
      <Provider store={store}>
        <ResetFiltersButton />
      </Provider>
    )

    const button = screen.getByRole("button", { name: /reset filters/i })
    expect(button).not.toBeDisabled()
  })

  it("resets filters when clicked", async () => {
    const store = createTestStore({ searchQuery: "test", minRating: 4 })
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <ResetFiltersButton />
      </Provider>
    )

    const button = screen.getByRole("button", { name: /reset filters/i })
    await user.click(button)

    // Check that filters were reset
    const state = store.getState().filters
    expect(state.searchQuery).toBe("")
    expect(state.minRating).toBeNull()
  })
})
