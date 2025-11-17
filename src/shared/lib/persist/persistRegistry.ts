import { getInitialFavoritesState } from "@/features/favorites"
import { getInitialLocalProductsState } from "@/features/local-products"

import type { RootState } from "../store"

export type PersistItem<T = unknown> = {
  /** localStorage key (versioned) */
  lsKey: string
  /** Selector to extract value from Redux state */
  select: (state: RootState) => T
  /** Optional: slice name for automatic hydration */
  sliceName?: keyof RootState
  /** Optional: hydration function to load initial state */
  hydrate?: () => T
}

export const persistRegistry: readonly PersistItem[] = [
  {
    lsKey: "app:favorites:v1",
    select: (state) => state.favorites,
    sliceName: "favorites",
    hydrate: getInitialFavoritesState,
  },
  {
    lsKey: "app:localProducts:v1",
    select: (state) => state.localProducts,
    sliceName: "localProducts",
    hydrate: getInitialLocalProductsState,
  },
]
