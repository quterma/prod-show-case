export {
  default as localProductsReducer,
  getInitialLocalProductsState,
} from "./localProductsSlice"
export {
  upsertLocalProduct,
  removeProduct,
  resetLocalProducts,
  type LocalProductsState,
  type LocalProductEntry,
  type UpsertLocalProductPayload,
} from "./localProductsSlice"

export {
  selectLocalProductsState,
  selectLocalProductsById,
  selectRemovedApiIds,
  selectLocalProductById,
  selectLocalProductsArray,
  selectIsLocalProduct,
  makeSelectIsRemoved,
  makeSelectMergedProduct,
  makeSelectMergedProducts,
} from "./selectors"
