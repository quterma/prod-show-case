import type { Middleware } from "@reduxjs/toolkit"

import { debounce } from "../debounce"
import type { AppStore } from "../store"

import { setToLS } from "./ls"
import { persistRegistry } from "./persistRegistry"

/**
 * Default debounce delay for all persist operations (ms)
 * Balances between performance and data safety
 */
const PERSIST_DEBOUNCE_MS = 300

/**
 * Flush all pending persist operations to localStorage
 * Used on beforeunload to prevent data loss
 */
export function flushPersist(store: AppStore): void {
  const state = store.getState()

  persistRegistry.forEach((item) => {
    const value = item.select(state)
    setToLS(item.lsKey, value)
  })
}

export const createPersistMiddleware = (): Middleware => {
  const prevSnapshots: unknown[] = []

  // Create debounced persist functions for all registry items
  const persistFns = persistRegistry.map((item) => {
    const persist = (value: unknown) => setToLS(item.lsKey, value)
    return debounce(persist, PERSIST_DEBOUNCE_MS)
  })

  return (api) => {
    // Initialize snapshots with current state to avoid redundant first persist
    const initialState = api.getState()
    persistRegistry.forEach((item, index) => {
      prevSnapshots[index] = item.select(initialState)
    })

    return (next) => (action) => {
      const result = next(action)
      const state = api.getState()

      persistRegistry.forEach((item, index) => {
        const nextValue = item.select(state)
        const prevValue = prevSnapshots[index]

        if (nextValue !== prevValue) {
          prevSnapshots[index] = nextValue
          persistFns[index](nextValue)
        }
      })

      return result
    }
  }
}
