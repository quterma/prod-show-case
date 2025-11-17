/**
 * Persistence utilities public API
 * Export localStorage helpers and preloaded state creator
 * Note: Middleware exports moved to @/shared/lib/store
 */

export { getFromLS, setToLS, removeFromLS } from "./ls"
export { safeLoadFromStorage } from "./safeLoadFromStorage"
export { createPreloadedState } from "./createPreloadedState"
