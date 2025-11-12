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
  it("renders nothing when no categories provided", () => {
    const store = createTestStore()
    const { container } = render(
      <Provider store={store}>
        <CategoryFilter categories={[]} />
      </Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  it("renders category checkboxes", () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics", "clothing"]} />
      </Provider>
    )

    expect(screen.getByText("electronics")).toBeInTheDocument()
    expect(screen.getByText("clothing")).toBeInTheDocument()
  })

  it("toggles category selection on click", async () => {
    const user = userEvent.setup()
    const store = createTestStore()

    render(
      <Provider store={store}>
        <CategoryFilter categories={["electronics"]} />
      </Provider>
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
})
