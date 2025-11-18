// Model exports
export {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  toggleShowOnlyFavorites,
  resetFavorites,
  getInitialFavoritesState,
  favoritesReducer,
  selectFavoriteIds,
  selectShowOnlyFavorites,
  makeSelectIsFavorite,
  makeSelectFavoriteProducts,
} from "./model"

// Hooks exports
export { useFavoriteProducts } from "./hooks"

// UI exports
export { FavoriteToggle, ShowOnlyFavoritesToggle } from "./ui"
