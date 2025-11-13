import type { Action, ThunkAction } from "@reduxjs/toolkit"
import {
  combineSlices,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import filtersReducer, {
  setSearchQuery,
  toggleCategory,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  toggleShowOnlyFavorites,
  resetFilters,
} from "@/features/filters/model/filtersSlice"
import paginationReducer, {
  resetPage,
} from "@/features/pagination/model/paginationSlice"
import removedReducer from "@/features/remove-product/model/removedSlice"

import { baseApi } from "../api/baseApi"

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(baseApi, {
  favorites: favoritesReducer,
  filters: filtersReducer,
  pagination: paginationReducer,
  removed: removedReducer,
})

// Listener middleware for pagination auto-reset
const listenerMiddleware = createListenerMiddleware()

// Reset pagination to page 1 when any filter changes
listenerMiddleware.startListening({
  matcher: isAnyOf(
    setSearchQuery,
    toggleCategory,
    setMinPrice,
    setMaxPrice,
    setMinRating,
    toggleShowOnlyFavorites,
    resetFilters
  ),
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(resetPage())
  },
})

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore RTK Query action types for serialization checks
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/PURGE",
            "persist/REGISTER",
          ],
        },
      })
        .concat(baseApi.middleware) // ESSENTIAL: RTK Query middleware for cache management
        .prepend(listenerMiddleware.middleware), // Listener middleware for pagination auto-reset
    devTools: process.env.NODE_ENV !== "production",
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
// Keep AppThunk for future custom async logic that RTK Query doesn't handle
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
