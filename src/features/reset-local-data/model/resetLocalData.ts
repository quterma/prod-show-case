import { resetFavorites } from "@/features/favorites"
import { resetFilters } from "@/features/filters"
import { resetLocalProducts } from "@/features/local-products"
import { baseApi } from "@/shared/api/baseApi"
import type { AppThunk } from "@/shared/lib/store"

/**
 * Thunk: Reset all localStorage data, filters, and invalidate RTK Query cache
 * Cross-feature operation that coordinates:
 * - Clearing favorites from Redux + localStorage
 * - Clearing local products and removed items from Redux + localStorage
 * - Resetting all active filters to initial state
 * - Invalidating RTK Query cache to trigger refetch
 */
export const resetLocalData = (): AppThunk => (dispatch) => {
  // Reset all local data
  dispatch(resetFavorites())
  dispatch(resetLocalProducts())
  dispatch(resetFilters())

  // Invalidate RTK Query cache to trigger refetch
  dispatch(baseApi.util.invalidateTags(["Product"]))
}
