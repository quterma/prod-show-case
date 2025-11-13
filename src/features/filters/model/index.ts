export {
  setSearchQuery,
  toggleCategory,
  setCategories,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  toggleShowOnlyFavorites,
  resetFilters,
} from "./filtersSlice"
export { default as filtersReducer } from "./filtersSlice"
export type { FiltersState } from "./filtersSlice"

export {
  selectSearchQuery,
  selectCategories,
  selectMinPrice,
  selectMaxPrice,
  selectMinRating,
  selectShowOnlyFavorites,
  selectHasActiveFilters,
  makeSelectFilteredProducts,
} from "./selectors"

export { useFilteredProducts } from "./useFilteredProducts"
