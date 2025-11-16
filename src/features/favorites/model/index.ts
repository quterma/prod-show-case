export {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  resetFavorites,
  getInitialFavoritesState,
  default as favoritesReducer,
} from "./favoritesSlice"

export {
  selectFavoriteIds,
  makeSelectIsFavorite,
  makeSelectFavoriteProducts,
} from "./selectors"
