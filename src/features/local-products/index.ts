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
  makeSelectVisibleProducts,
  makeSelectMergedProducts,
  useMergedProducts,
  getInitialLocalProductsState,
} from "./model"

export type { LocalProductsState, LocalProductEntry } from "./model"

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
