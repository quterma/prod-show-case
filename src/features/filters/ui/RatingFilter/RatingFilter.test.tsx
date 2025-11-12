import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import filtersReducer from "@/features/filters/model/filtersSlice"
import { baseApi } from "@/shared/api/baseApi"

import { RatingFilter } from "./RatingFilter"

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

describe("RatingFilter", () => {
  it("renders rating dropdown with options", () => {
    const store = createTestStore()
    render(
      <Provider store={store}>
        <RatingFilter />
      </Provider>
    )

    expect(screen.getByText("Rating:")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("changes rating on selection", async () => {
    const user = userEvent.setup()
    const store = createTestStore()

    render(
      <Provider store={store}>
        <RatingFilter />
      </Provider>
    )

    const select = screen.getByRole("combobox")
    await user.selectOptions(select, "4")

    expect(select).toHaveValue("4")
  })

  it("resets to all ratings", async () => {
    const user = userEvent.setup()
    const store = createTestStore({ minRating: 4 })

    render(
      <Provider store={store}>
        <RatingFilter />
      </Provider>
    )

    const select = screen.getByRole("combobox")
    expect(select).toHaveValue("4")

    await user.selectOptions(select, "")
    expect(select).toHaveValue("")
  })
})
