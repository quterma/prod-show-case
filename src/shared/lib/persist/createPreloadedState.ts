import { persistRegistry } from "./persistRegistry"

/**
 * Create preloadedState from persist registry
 * Automatically hydrates all slices that have hydration functions registered
 *
 * @returns Preloaded state object for Redux store
 *
 * @example
 * ```ts
 * const preloadedState = createPreloadedState()
 * configureStore({ reducer, preloadedState })
 * ```
 */
export function createPreloadedState(): Record<string, unknown> {
  const preloadedState: Record<string, unknown> = {}

  persistRegistry.forEach((item) => {
    if (item.sliceName && item.hydrate) {
      preloadedState[item.sliceName] = item.hydrate()
    }
  })

  return preloadedState
}
