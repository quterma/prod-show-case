export {
  setSearchQuery,
  toggleCategory,
  setCategories,
  setMinPrice,
  setMaxPrice,
  setMinRating,
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
  selectHasActiveFilters,
  makeSelectFilteredProducts,
} from "./selectors"
