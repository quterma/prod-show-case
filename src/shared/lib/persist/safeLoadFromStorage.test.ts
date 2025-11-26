import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import * as loggerModule from "../logger"

import { safeLoadFromStorage } from "./safeLoadFromStorage"

describe("safeLoadFromStorage", () => {
  const mockKey = "test:key:v1"
  const mockFallback = { items: [], count: 0 }

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("returns fallback when key does not exist", () => {
    const result = safeLoadFromStorage(mockKey, mockFallback)
    expect(result).toEqual(mockFallback)
  })

  it("loads valid data from localStorage", () => {
    const testData = { items: ["a", "b"], count: 2 }
    localStorage.setItem(mockKey, JSON.stringify(testData))

    const result = safeLoadFromStorage(mockKey, mockFallback)
    expect(result).toEqual(testData)
  })

  it("returns fallback when JSON is corrupted", () => {
    const loggerErrorSpy = vi
      .spyOn(loggerModule.logger, "error")
      .mockImplementation(() => {
        // suppress error output
      })

    // Invalid JSON
    localStorage.setItem(mockKey, "{broken json")

    const result = safeLoadFromStorage(mockKey, mockFallback)
    expect(result).toEqual(mockFallback)
    expect(loggerErrorSpy).toHaveBeenCalled()

    loggerErrorSpy.mockRestore()
  })

  it("returns fallback when type mismatch (object vs primitive)", () => {
    const loggerWarnSpy = vi
      .spyOn(loggerModule.logger, "warn")
      .mockImplementation(() => {
        // suppress warning output
      })

    // Store string instead of object
    localStorage.setItem(mockKey, JSON.stringify("wrong type"))

    const result = safeLoadFromStorage(mockKey, mockFallback)
    expect(result).toEqual(mockFallback)
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Type mismatch")
    )

    loggerWarnSpy.mockRestore()
  })

  it("returns fallback when expecting array but got object", () => {
    const loggerWarnSpy = vi
      .spyOn(loggerModule.logger, "warn")
      .mockImplementation(() => {
        // suppress warning output
      })

    const arrayFallback: string[] = []
    // Store object instead of array
    localStorage.setItem(mockKey, JSON.stringify({ key: "value" }))

    const result = safeLoadFromStorage(mockKey, arrayFallback)
    expect(result).toEqual(arrayFallback)
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("expected array")
    )

    loggerWarnSpy.mockRestore()
  })

  it("handles null localStorage value", () => {
    const result = safeLoadFromStorage("nonexistent:key", mockFallback)
    expect(result).toEqual(mockFallback)
  })

  it("loads primitive values correctly", () => {
    const primitiveKey = "test:primitive"
    const primitiveFallback = 42

    localStorage.setItem(primitiveKey, JSON.stringify(100))

    const result = safeLoadFromStorage(primitiveKey, primitiveFallback)
    expect(result).toBe(100)
  })

  it("loads arrays correctly", () => {
    const arrayKey = "test:array"
    const arrayFallback = [1, 2, 3]
    const testArray = [4, 5, 6]

    localStorage.setItem(arrayKey, JSON.stringify(testArray))

    const result = safeLoadFromStorage(arrayKey, arrayFallback)
    expect(result).toEqual(testArray)
  })
})
