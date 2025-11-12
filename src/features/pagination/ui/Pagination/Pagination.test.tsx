import { configureStore } from "@reduxjs/toolkit"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import paginationReducer from "../../model/paginationSlice"

import { Pagination } from "./Pagination"

function createTestStore(initialState = {}) {
  return configureStore({
    reducer: {
      pagination: paginationReducer,
    },
    preloadedState: {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        ...initialState,
      },
    },
  })
}

describe("Pagination", () => {
  it("does not render when totalPages <= 1", () => {
    const store = createTestStore()

    const { container } = render(
      <Provider store={store}>
        <Pagination totalPages={1} />
      </Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  it("renders pagination controls when totalPages > 1", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <Pagination totalPages={3} />
      </Provider>
    )

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
  })

  it("disables Previous button on first page", () => {
    const store = createTestStore({ currentPage: 1 })

    render(
      <Provider store={store}>
        <Pagination totalPages={3} />
      </Provider>
    )

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled()
  })

  it("disables Next button on last page", () => {
    const store = createTestStore({ currentPage: 3 })

    render(
      <Provider store={store}>
        <Pagination totalPages={3} />
      </Provider>
    )

    expect(screen.getByRole("button", { name: /previous/i })).not.toBeDisabled()
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled()
  })

  it("navigates to next page when Next clicked", async () => {
    const store = createTestStore({ currentPage: 1 })
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <Pagination totalPages={3} />
      </Provider>
    )

    await user.click(screen.getByRole("button", { name: /next/i }))

    expect(store.getState().pagination.currentPage).toBe(2)
  })

  it("navigates to previous page when Previous clicked", async () => {
    const store = createTestStore({ currentPage: 2 })
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <Pagination totalPages={3} />
      </Provider>
    )

    await user.click(screen.getByRole("button", { name: /previous/i }))

    expect(store.getState().pagination.currentPage).toBe(1)
  })
})
