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
} from "./model"

export type { LocalProductsState, LocalProductEntry } from "./model"

// UI exports
export { RemoveButton } from "./ui"
