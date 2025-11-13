import { resetFavorites } from "@/features/favorites"
import { baseApi } from "@/shared/api/baseApi"
import type { AppThunk } from "@/shared/lib/store"

/**
 * Thunk: Reset all localStorage data and invalidate RTK Query cache
 * Cross-feature operation that coordinates:
 * - Clearing favorites from Redux + localStorage
 * - Invalidating RTK Query cache to trigger refetch
 * - Future: will also clear removed items and drafts
 */
export const resetLocalData = (): AppThunk => (dispatch) => {
  // Reset all local data
  dispatch(resetFavorites())
  // TODO: dispatch(resetRemoved()) when removed feature is added
  // TODO: dispatch(resetDrafts()) when drafts feature is added

  // Invalidate RTK Query cache to trigger refetch
  dispatch(baseApi.util.invalidateTags(["Product"]))
}
