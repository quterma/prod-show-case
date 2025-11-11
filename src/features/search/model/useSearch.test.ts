import { act, renderHook } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { useSearch } from "./useSearch"

describe("useSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it("initializes with empty search query", () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.searchQuery).toBe("")
    expect(result.current.debouncedQuery).toBe("")
  })

  it("updates searchQuery immediately", () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setSearchQuery("test")
    })

    expect(result.current.searchQuery).toBe("test")
    expect(result.current.debouncedQuery).toBe("") // Not debounced yet
  })

  it("debounces query update with default 300ms delay", () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setSearchQuery("test")
    })

    expect(result.current.debouncedQuery).toBe("")

    // Fast-forward time by 300ms
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.debouncedQuery).toBe("test")
  })

  it("debounces query update with custom delay", () => {
    const { result } = renderHook(() => useSearch(500))

    act(() => {
      result.current.setSearchQuery("test")
    })

    expect(result.current.debouncedQuery).toBe("")

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.debouncedQuery).toBe("test")
  })

  it("cancels previous debounce when query changes rapidly", () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setSearchQuery("test1")
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current.setSearchQuery("test2")
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current.setSearchQuery("test3")
    })

    // Only the last query should be debounced
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.debouncedQuery).toBe("test3")
  })

  it("cleans up timer on unmount", () => {
    const { result, unmount } = renderHook(() => useSearch())

    act(() => {
      result.current.setSearchQuery("test")
    })

    unmount()

    // Should not throw or leak timers
    expect(vi.getTimerCount()).toBe(0)
  })
})
