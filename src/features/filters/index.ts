// Model exports
export {
  setSearchQuery,
  toggleCategory,
  setCategories,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  toggleShowOnlyFavorites,
  resetFilters,
  selectSearchQuery,
  selectCategories,
  selectMinPrice,
  selectMaxPrice,
  selectMinRating,
  selectShowOnlyFavorites,
  selectHasActiveFilters,
  makeSelectFilteredProducts,
  useFilteredProducts,
} from "./model"
export { default as filtersReducer } from "./model/filtersSlice"
export type { FiltersState } from "./model"

// UI exports
export {
  CategoryFilter,
  PriceRangeFilter,
  QueryFilter,
  RatingFilter,
  ResetFiltersButton,
  ShowOnlyFavoritesToggle,
} from "./ui"
