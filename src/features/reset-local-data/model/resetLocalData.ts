import { resetFavorites } from "@/features/favorites"
import { resetRemoved } from "@/features/remove-product"
import { baseApi } from "@/shared/api/baseApi"
import type { AppThunk } from "@/shared/lib/store"

/**
 * Thunk: Reset all localStorage data and invalidate RTK Query cache
 * Cross-feature operation that coordinates:
 * - Clearing favorites from Redux + localStorage
 * - Clearing removed items from Redux + localStorage
 * - Invalidating RTK Query cache to trigger refetch
 * - Future: will also clear drafts and locally created/edited products
 */
export const resetLocalData = (): AppThunk => (dispatch) => {
  // Reset all local data
  dispatch(resetFavorites())
  dispatch(resetRemoved())
  // TODO: dispatch(resetDrafts()) when drafts feature is added
  // TODO: dispatch(resetLocalProducts()) when local create/edit is added

  // Invalidate RTK Query cache to trigger refetch
  dispatch(baseApi.util.invalidateTags(["Product"]))
}
