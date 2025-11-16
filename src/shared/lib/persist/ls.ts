/**
 * LocalStorage persistence utilities
 * Provides type-safe localStorage operations with error handling
 */

/**
 * Get value from localStorage with JSON parsing
 * Returns null if key doesn't exist or parsing fails
 *
 * @param key - localStorage key
 * @returns Parsed value or null
 */
export function getFromLS<T>(key: string): T | null {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === "undefined" || !window.localStorage) {
      return null
    }

    const item = window.localStorage.getItem(key)

    if (item === null) {
      return null
    }

    return JSON.parse(item) as T
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error reading from localStorage (key: ${key}):`, error)
    return null
  }
}

/**
 * Set value to localStorage with JSON stringification
 * Handles errors gracefully and logs failures
 *
 * @param key - localStorage key
 * @param value - Value to store (will be JSON stringified)
 */
export function setToLS<T>(key: string, value: T): void {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === "undefined" || !window.localStorage) {
      return
    }

    const serialized = JSON.stringify(value)
    const sizeInKB = serialized.length / 1024

    // Warn if data is large (> 1MB)
    if (sizeInKB > 1024) {
      // eslint-disable-next-line no-console
      console.warn(
        `Large localStorage write (${key}): ${sizeInKB.toFixed(2)}KB. Consider data optimization.`
      )
    }

    window.localStorage.setItem(key, serialized)
  } catch (error) {
    // Special handling for quota exceeded
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      // eslint-disable-next-line no-console
      console.error(
        `localStorage quota exceeded (${key}). Consider clearing old data or reducing data size.`
      )
    } else {
      // eslint-disable-next-line no-console
      console.error(`Error writing to localStorage (key: ${key}):`, error)
    }
  }
}

/**
 * Remove value from localStorage
 * Handles errors gracefully
 *
 * @param key - localStorage key to remove
 */
export function removeFromLS(key: string): void {
  try {
    // Check if localStorage is available (SSR safety)
    if (typeof window === "undefined" || !window.localStorage) {
      return
    }

    window.localStorage.removeItem(key)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error removing from localStorage (key: ${key}):`, error)
  }
}
