import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"

import {
  favoritesReducer,
  getInitialFavoritesState,
} from "@/features/favorites"
import { filtersReducer } from "@/features/filters"
import { localProductsReducer } from "@/features/local-products"
import { paginationReducer } from "@/features/pagination"

import { baseApi } from "../api/baseApi"

const rootReducer = combineSlices(baseApi, {
  favorites: favoritesReducer,
  filters: filtersReducer,
  pagination: paginationReducer,
  localProducts: localProductsReducer,
})

// Preloaded state with hydration from localStorage
// Each slice provides a getter function for hydration
const preloadedState = {
  favorites: getInitialFavoritesState(),
}

export const makeStore = () => {
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
      }).concat(baseApi.middleware),
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
