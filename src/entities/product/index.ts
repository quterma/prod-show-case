// Model exports (types and mappers)
export type {
  ProductId,
  ProductRating,
  Product,
  ProductDTO,
  ProductsList,
  ProductsListDTO,
  ProductFilters,
  ProductState,
} from "./model"
export { mapProductDTO, mapProductsDTO } from "./model"

// API exports
export { productsApi, useGetProductsQuery, useGetProductByIdQuery } from "./api"

// Lib exports (hooks)
export { useDynamicCategories, useDynamicPriceRange } from "./lib"

// UI exports
export {
  ProductCard,
  ProductCardSkeleton,
  ProductDetailCard,
  ProductDetailCardSkeleton,
} from "./ui"
