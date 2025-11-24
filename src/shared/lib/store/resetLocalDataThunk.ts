import { resetFavorites } from "@/features/favorites/model/favoritesSlice"
import { resetFilters } from "@/features/filters/model/filtersSlice"
import { resetLocalProducts } from "@/features/local-products/model/localProductsSlice"
import { resetCurrentPage } from "@/features/pagination/model/paginationSlice"

import { baseApi } from "../../api/baseApi"

import type { AppThunk } from "./store"

/**
 * Reset all local data thunk
 *
 * Cross-feature coordination operation that:
 * - Clears favorites from Redux + localStorage
 * - Clears local products and removed items from Redux + localStorage
 * - Resets all active filters to initial state
 * - Resets pagination to first page
 * - Invalidates RTK Query cache to trigger refetch
 *
 * This is an infrastructure-level operation (not a feature) since it
 * coordinates multiple features. Lives in shared/lib/store alongside
 * other store coordination utilities (middleware, etc.)
 */
export const resetLocalData = (): AppThunk => (dispatch) => {
  // Reset all local data
  dispatch(resetFavorites())
  dispatch(resetLocalProducts())
  dispatch(resetFilters())
  dispatch(resetCurrentPage())

  // Invalidate RTK Query cache to trigger refetch
  dispatch(baseApi.util.invalidateTags(["Product"]))
}
