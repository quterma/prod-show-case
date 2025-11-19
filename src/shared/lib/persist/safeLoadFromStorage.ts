/**
 * Safe hydration helper for loading persisted state from localStorage
 * Provides fallback to initial state on errors
 *
 * Usage:
 * ```ts
 * const preloadedState = {
 *   favorites: safeLoadFromStorage('app:favorites:v2', { favoriteIds: [] }),
 * }
 * ```
 */

import { getFromLS } from "./ls"

/**
 * Safely load state from localStorage with fallback
 *
 * @param storageKey - Versioned localStorage key (e.g., "app:favorites:v2")
 * @param fallback - Fallback value if loading fails or key doesn't exist
 * @returns Loaded state or fallback
 */
export function safeLoadFromStorage<T>(storageKey: string, fallback: T): T {
  try {
    const loaded = getFromLS<T>(storageKey)

    if (loaded === null) {
      return fallback
    }

    // Basic sanity check: ensure loaded data has same structure type as fallback
    if (typeof loaded !== typeof fallback) {
      // eslint-disable-next-line no-console
      console.warn(
        `Type mismatch for storage key "${storageKey}": expected ${typeof fallback}, got ${typeof loaded}. Using fallback.`
      )
      return fallback
    }

    // Additional check for arrays
    if (Array.isArray(fallback) && !Array.isArray(loaded)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Type mismatch for storage key "${storageKey}": expected array, got non-array. Using fallback.`
      )
      return fallback
    }

    return loaded
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load from storage (key: "${storageKey}"):`, error)
    return fallback
  }
}
