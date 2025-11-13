export {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  resetFavorites,
  default as favoritesReducer,
} from "./favoritesSlice"

export {
  selectFavoriteIds,
  makeSelectIsFavorite,
  makeSelectFavoriteProducts,
} from "./selectors"
