// Model exports
export {
  localProductsReducer,
  upsertLocalProduct,
  removeProduct,
  resetLocalProducts,
  selectLocalProductsState,
  selectLocalProductsById,
  selectRemovedApiIds,
  selectLocalProductById,
  selectLocalProductsArray,
  selectIsLocalProduct,
  makeSelectIsRemoved,
  makeSelectMergedProduct,
  makeSelectMergedProducts,
  getInitialLocalProductsState,
} from "./model"

export type { LocalProductsState, LocalProductEntry } from "./model"

// Hooks exports
export { useMergedProduct, useMergedProducts } from "./hooks"

// Lib exports
export {
  removeDeletedProducts,
  applyProductPatches,
  addLocalProducts,
  sortProductsByTitle,
  mergeLocalProducts,
} from "./lib"

// UI exports
export { RemoveButton } from "./ui"
