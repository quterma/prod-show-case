/**
 * Factory for creating hydration getter functions
 * Provides a clean pattern for loading persisted state from localStorage
 *
 * Usage:
 * ```ts
 * // In slice file
 * export const getInitialFavoritesState = createHydratedState(
 *   'app:favorites:v1',
 *   { favoriteIds: [] }
 * )
 *
 * // In store.ts
 * const preloadedState = {
 *   favorites: getInitialFavoritesState()
 * }
 * ```
 */

import { safeLoadFromStorage } from "./safeLoadFromStorage"

/**
 * Creates a getter function for hydrated state from localStorage
 *
 * @param storageKey - Versioned localStorage key (e.g., "app:favorites:v1")
 * @param defaultState - Fallback state if localStorage is empty or invalid
 * @returns Function that returns hydrated state when called
 */
export function createHydratedState<T>(storageKey: string, defaultState: T) {
  return (): T => safeLoadFromStorage(storageKey, defaultState)
}
