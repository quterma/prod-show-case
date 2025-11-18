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
} from "./model"
export { default as filtersReducer } from "./model/filtersSlice"
export type { FiltersState } from "./model"

// Hooks exports
export { useFilteredProducts } from "./hooks"

// UI exports
export {
  CategoryFilter,
  PriceRangeFilter,
  QueryFilter,
  RatingFilter,
  ResetFiltersButton,
} from "./ui"
