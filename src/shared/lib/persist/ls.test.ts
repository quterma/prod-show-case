import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { getFromLS, setToLS, removeFromLS } from "./ls"

describe("localStorage utilities", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe("getFromLS", () => {
    it("returns null when key does not exist", () => {
      const result = getFromLS("nonexistent")
      expect(result).toBeNull()
    })

    it("returns parsed value for existing key", () => {
      const testData = { name: "test", count: 42 }
      localStorage.setItem("test:key", JSON.stringify(testData))

      const result = getFromLS("test:key")
      expect(result).toEqual(testData)
    })

    it("returns null when JSON parsing fails", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {
          // suppress error output
        })

      localStorage.setItem("broken", "{invalid json")

      const result = getFromLS("broken")
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it("handles primitive values", () => {
      localStorage.setItem("number", JSON.stringify(123))
      expect(getFromLS("number")).toBe(123)

      localStorage.setItem("string", JSON.stringify("hello"))
      expect(getFromLS("string")).toBe("hello")

      localStorage.setItem("boolean", JSON.stringify(true))
      expect(getFromLS("boolean")).toBe(true)
    })

    it("handles arrays", () => {
      const testArray = [1, 2, 3, 4, 5]
      localStorage.setItem("array", JSON.stringify(testArray))

      const result = getFromLS("array")
      expect(result).toEqual(testArray)
    })
  })

  describe("setToLS", () => {
    it("stores value with JSON stringification", () => {
      const testData = { key: "value", num: 42 }
      setToLS("test", testData)

      const stored = localStorage.getItem("test")
      expect(stored).toBe(JSON.stringify(testData))
    })

    it("warns when data is large (> 1MB)", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {
          // suppress warning output
        })

      // Create large data (> 1MB)
      const largeData = "x".repeat(1024 * 1024 + 1)
      setToLS("large", largeData)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Large localStorage write")
      )

      consoleWarnSpy.mockRestore()
    })

    // Note: Quota exceeded error test skipped due to difficulty mocking DOMException in happy-dom

    it("stores arrays correctly", () => {
      const testArray = [1, 2, 3]
      setToLS("array", testArray)

      const stored = localStorage.getItem("array")
      expect(stored).toBe(JSON.stringify(testArray))
    })

    it("stores primitives correctly", () => {
      setToLS("number", 42)
      expect(localStorage.getItem("number")).toBe("42")

      setToLS("string", "hello")
      expect(localStorage.getItem("string")).toBe('"hello"')

      setToLS("boolean", true)
      expect(localStorage.getItem("boolean")).toBe("true")
    })
  })

  describe("removeFromLS", () => {
    it("removes key from localStorage", () => {
      localStorage.setItem("test", "value")
      expect(localStorage.getItem("test")).toBe("value")

      removeFromLS("test")
      expect(localStorage.getItem("test")).toBeNull()
    })

    it("handles non-existent keys gracefully", () => {
      expect(() => removeFromLS("nonexistent")).not.toThrow()
    })

    // Note: Error handling test skipped due to difficulty mocking localStorage errors in happy-dom
  })
})
