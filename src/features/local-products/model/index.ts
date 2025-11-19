export {
  default as localProductsReducer,
  getInitialLocalProductsState,
} from "./localProductsSlice"
export {
  upsertLocalProduct,
  removeProduct,
  resetLocalProducts,
  type LocalProductsState,
  type UpsertLocalProductPayload,
} from "./localProductsSlice"

export {
  selectLocalProductsState,
  selectLocalProductsById,
  selectRemovedProductIds,
  selectLocalProductById,
  selectLocalProductsArray,
  selectIsLocalProduct,
  makeSelectIsRemoved,
  makeSelectMergedProduct,
  makeSelectMergedProducts,
} from "./selectors"
