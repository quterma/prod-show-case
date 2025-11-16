import { beforeEach, describe, expect, it, vi } from "vitest"

import { debounce } from "./debounce"

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("delays function execution", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("cancels pending execution on multiple calls", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("can be cancelled manually", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    debounced.cancel()

    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })

  it("passes arguments to the debounced function", () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced("arg1", 123)
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledWith("arg1", 123)
  })
})
