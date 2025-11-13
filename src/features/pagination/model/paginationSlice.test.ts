import { describe, it, expect } from "vitest"

import paginationReducer, {
  setPage,
  setPageSize,
  resetPage,
  setMaxPage,
  PAGE_SIZE,
} from "./paginationSlice"

describe("paginationSlice", () => {
  const initialState = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    maxPage: null,
  }

  describe("setPage", () => {
    it("sets the current page to the provided value", () => {
      const state = paginationReducer(initialState, setPage(3))

      expect(state.currentPage).toBe(3)
      expect(state.pageSize).toBe(PAGE_SIZE) // pageSize unchanged
    })

    it("allows setting page to 1", () => {
      const state = paginationReducer(
        { currentPage: 5, pageSize: PAGE_SIZE, maxPage: null },
        setPage(1)
      )

      expect(state.currentPage).toBe(1)
    })

    it("clamps negative page numbers to 1", () => {
      const state = paginationReducer(initialState, setPage(-5))

      expect(state.currentPage).toBe(1)
    })

    it("clamps zero to 1", () => {
      const state = paginationReducer(initialState, setPage(0))

      expect(state.currentPage).toBe(1)
    })

    it("allows large page numbers when maxPage not set", () => {
      const state = paginationReducer(initialState, setPage(999))

      expect(state.currentPage).toBe(999)
    })

    it("clamps page to maxPage when maxPage is set", () => {
      const state = paginationReducer(
        { currentPage: 1, pageSize: PAGE_SIZE, maxPage: 5 },
        setPage(999)
      )

      expect(state.currentPage).toBe(5)
    })
  })

  describe("setPageSize", () => {
    it("updates page size and resets to page 1", () => {
      const state = paginationReducer(
        { currentPage: 5, pageSize: PAGE_SIZE, maxPage: null },
        setPageSize(20)
      )

      expect(state.pageSize).toBe(20)
      expect(state.currentPage).toBe(1) // Reset to first page
    })

    it("resets to page 1 even when already on page 1", () => {
      const state = paginationReducer(initialState, setPageSize(15))

      expect(state.pageSize).toBe(15)
      expect(state.currentPage).toBe(1)
    })
  })

  describe("resetPage", () => {
    it("resets current page to 1", () => {
      const state = paginationReducer(
        { currentPage: 10, pageSize: PAGE_SIZE, maxPage: null },
        resetPage()
      )

      expect(state.currentPage).toBe(1)
      expect(state.pageSize).toBe(PAGE_SIZE) // pageSize unchanged
    })

    it("does nothing when already on page 1", () => {
      const state = paginationReducer(initialState, resetPage())

      expect(state.currentPage).toBe(1)
      expect(state.pageSize).toBe(PAGE_SIZE)
    })
  })

  describe("initial state", () => {
    it("has correct initial values", () => {
      const state = paginationReducer(undefined, { type: "unknown" })

      expect(state).toEqual({
        currentPage: 1,
        pageSize: PAGE_SIZE,
        maxPage: null,
      })
    })
  })

  describe("setMaxPage", () => {
    it("sets maxPage value", () => {
      const state = paginationReducer(initialState, setMaxPage(10))

      expect(state.maxPage).toBe(10)
    })

    it("clamps maxPage to minimum 1", () => {
      const state = paginationReducer(initialState, setMaxPage(0))

      expect(state.maxPage).toBe(1)
    })

    it("auto-corrects currentPage when it exceeds new maxPage", () => {
      const state = paginationReducer(
        { currentPage: 10, pageSize: PAGE_SIZE, maxPage: null },
        setMaxPage(3)
      )

      expect(state.maxPage).toBe(3)
      expect(state.currentPage).toBe(3)
    })

    it("does not change currentPage when within bounds", () => {
      const state = paginationReducer(
        { currentPage: 2, pageSize: PAGE_SIZE, maxPage: null },
        setMaxPage(5)
      )

      expect(state.maxPage).toBe(5)
      expect(state.currentPage).toBe(2)
    })
  })
})
