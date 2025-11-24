import { describe, it, expect } from "vitest"

import paginationReducer, {
  setCurrentPage,
  setPageSize,
  resetCurrentPage,
  PAGE_SIZE,
} from "./paginationSlice"

describe("paginationSlice", () => {
  const initialState = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
  }

  describe("setCurrentPage", () => {
    it("sets the current page to the provided value", () => {
      const state = paginationReducer(initialState, setCurrentPage(3))

      expect(state.currentPage).toBe(3)
      expect(state.pageSize).toBe(PAGE_SIZE) // pageSize unchanged
    })

    it("allows setting page to 1", () => {
      const state = paginationReducer(
        { currentPage: 5, pageSize: PAGE_SIZE },
        setCurrentPage(1)
      )

      expect(state.currentPage).toBe(1)
    })

    it("clamps negative page numbers to 1", () => {
      const state = paginationReducer(initialState, setCurrentPage(-5))

      expect(state.currentPage).toBe(1)
    })

    it("clamps zero to 1", () => {
      const state = paginationReducer(initialState, setCurrentPage(0))

      expect(state.currentPage).toBe(1)
    })

    it("allows large page numbers", () => {
      const state = paginationReducer(initialState, setCurrentPage(999))

      expect(state.currentPage).toBe(999)
    })
  })

  describe("setPageSize", () => {
    it("updates page size and resets to page 1", () => {
      const state = paginationReducer(
        { currentPage: 5, pageSize: PAGE_SIZE },
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

  describe("resetCurrentPage", () => {
    it("resets current page to 1", () => {
      const state = paginationReducer(
        { currentPage: 10, pageSize: PAGE_SIZE },
        resetCurrentPage()
      )

      expect(state.currentPage).toBe(1)
      expect(state.pageSize).toBe(PAGE_SIZE) // pageSize unchanged
    })

    it("does nothing when already on page 1", () => {
      const state = paginationReducer(initialState, resetCurrentPage())

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
      })
    })
  })
})
