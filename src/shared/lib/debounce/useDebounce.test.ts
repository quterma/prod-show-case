import { act, renderHook } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { useDebounce } from "./useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300))

    expect(result.current).toBe("initial")
  })

  it("debounces value updates with default 300ms delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    )

    expect(result.current).toBe("initial")

    // Update value
    rerender({ value: "updated" })

    // Value should not update immediately
    expect(result.current).toBe("initial")

    // Fast-forward time by 300ms
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Value should now be updated
    expect(result.current).toBe("updated")
  })

  it("debounces value updates with custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })

    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe("updated")
  })

  it("cancels previous debounce when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "update1" })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: "update2" })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: "final" })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Only the last value should be debounced
    expect(result.current).toBe("final")
  })

  it("works with different types", () => {
    const { result: stringResult } = renderHook(() => useDebounce("test", 300))
    const { result: numberResult } = renderHook(() => useDebounce(42, 300))
    const { result: objectResult } = renderHook(() =>
      useDebounce({ key: "value" }, 300)
    )

    expect(stringResult.current).toBe("test")
    expect(numberResult.current).toBe(42)
    expect(objectResult.current).toEqual({ key: "value" })
  })

  it("cleans up timer on unmount", () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })

    unmount()

    // Should not throw or leak timers
    expect(vi.getTimerCount()).toBe(0)
  })
})
