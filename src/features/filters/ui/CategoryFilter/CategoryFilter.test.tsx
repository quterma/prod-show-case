import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import filtersReducer from "@/features/filters/model/filtersSlice"
import { baseApi } from "@/shared/api/baseApi"

import { CategoryFilter } from "./CategoryFilter"

function createTestStore(initialFilters = {}) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    preloadedState: {
      filters: {
        searchQuery: "",
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

describe("CategoryFilter", () => {
  it("renders category multi-select dropdown", () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics", "clothing"]} />
      </Provider>
    )

    // Should show "All selected" when no categories selected (ALL state)
    expect(screen.getByText("All selected")).toBeInTheDocument()
    expect(screen.getByText("Categories:")).toBeInTheDocument()
  })

  it("toggles category selection on click", async () => {
    const user = userEvent.setup()
    const store = createTestStore()

    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics", "clothing"]} />
      </Provider>
    )

    // Open dropdown
    const button = screen.getByRole("button", { name: /All selected/i })
    await user.click(button)

    // Find and click electronics option (second occurrence - first is "All" option)
    const electronicsOptions = screen.getAllByText("electronics")
    await user.click(electronicsOptions[0])

    // Button should now show "1 selected"
    expect(screen.getByText("1 selected")).toBeInTheDocument()
  })

  it("displays count when multiple categories selected", async () => {
    const user = userEvent.setup()
    const store = createTestStore()

    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics", "clothing", "books"]} />
      </Provider>
    )

    // Open dropdown
    const button = screen.getByRole("button", { name: /All selected/i })
    await user.click(button)

    // Select two categories by clicking on text
    await user.click(screen.getByText("electronics"))
    await user.click(screen.getByText("clothing"))

    // Should show "2 selected"
    expect(screen.getByText("2 selected")).toBeInTheDocument()
  })

  it("resets to All selected when clicking All option", async () => {
    const user = userEvent.setup()
    const store = createTestStore()

    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics", "clothing"]} />
      </Provider>
    )

    // Open dropdown
    const button = screen.getByRole("button", { name: /All selected/i })
    await user.click(button)

    // Click the "All" option in dropdown
    const allOption = screen.getByText("All")
    await user.click(allOption)

    // Button should show "All selected" (reset to ALL state)
    expect(
      screen.getByRole("button", { name: /All selected/i })
    ).toBeInTheDocument()
  })

  it("keeps All selected when clicking All option while categories in store", async () => {
    const user = userEvent.setup()
    const store = createTestStore({
      categories: ["electronics", "clothing"],
    })

    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics", "clothing"]} />
      </Provider>
    )

    // Should show "All selected" when all categories are selected in store
    expect(screen.getByText("All selected")).toBeInTheDocument()

    // Open dropdown
    const button = screen.getByRole("button", { name: /All selected/i })
    await user.click(button)

    // Click the "All" option in dropdown to reset to ALL state (empty array)
    const allOption = screen.getByText("All")
    await user.click(allOption)

    // Button should still show "All selected" (empty state = ALL = no filter)
    expect(
      screen.getByRole("button", { name: /All selected/i })
    ).toBeInTheDocument()
  })
})
