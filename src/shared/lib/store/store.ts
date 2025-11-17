import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"

import favoritesReducer from "@/features/favorites/model/favoritesSlice"
import filtersReducer from "@/features/filters/model/filtersSlice"
import localProductsReducer from "@/features/local-products/model/localProductsSlice"
import paginationReducer from "@/features/pagination/model/paginationSlice"

import { baseApi } from "../../api/baseApi"
import { createPreloadedState } from "../persist/"

import { createCleanupFavoriteMiddleware } from "./cleanupFavoriteMiddleware"
import { createPersistMiddleware } from "./persistMiddleware"

const rootReducer = combineSlices(baseApi, {
  favorites: favoritesReducer,
  filters: filtersReducer,
  pagination: paginationReducer,
  localProducts: localProductsReducer,
})

export const makeStore = () => {
  // Create preloadedState per store instance (important for SSR)
  const preloadedState = createPreloadedState()
  const persistMiddleware = createPersistMiddleware()
  const cleanupFavoriteMiddleware = createCleanupFavoriteMiddleware()

  return configureStore({
    reducer: rootReducer,
    preloadedState,
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
        .concat(baseApi.middleware)
        .concat(cleanupFavoriteMiddleware)
        .concat(persistMiddleware),
    devTools: process.env.NODE_ENV !== "production",
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
