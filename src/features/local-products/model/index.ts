export { default as localProductsReducer } from "./localProductsSlice"
export {
  upsertLocalProduct,
  removeProduct,
  resetLocalProducts,
} from "./localProductsSlice"

export {
  selectLocalProductsState,
  selectLocalProductsById,
  selectRemovedApiIds,
  selectLocalProductById,
  selectLocalProductsArray,
  selectIsLocalProduct,
  makeSelectIsRemoved,
  makeSelectVisibleProducts,
} from "./selectors"
