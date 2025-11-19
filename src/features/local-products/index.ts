// Model exports
export {
  localProductsReducer,
  upsertLocalProduct,
  removeProduct,
  resetLocalProducts,
  selectLocalProductsState,
  selectLocalProductsById,
  selectRemovedProductIds,
  selectLocalProductById,
  selectLocalProductsArray,
  selectIsLocalProduct,
  makeSelectIsRemoved,
  makeSelectMergedProduct,
  makeSelectMergedProducts,
  getInitialLocalProductsState,
} from "./model"

export type { LocalProductsState, UpsertLocalProductPayload } from "./model"

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
