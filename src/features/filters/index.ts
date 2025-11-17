// Model exports
export {
  setSearchQuery,
  toggleCategory,
  setCategories,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  resetFilters,
  selectSearchQuery,
  selectCategories,
  selectMinPrice,
  selectMaxPrice,
  selectMinRating,
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
} from "./ui"
