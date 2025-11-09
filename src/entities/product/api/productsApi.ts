// TODO: Implement RTK Query endpoints using baseApi.injectEndpoints
// Example endpoints: getProducts, getProductById, createProduct, updateProduct, deleteProduct

import { baseApi } from "@/shared/api"

export const productsApi = baseApi.injectEndpoints({
  endpoints: () => ({}),
})

// TODO: Export hooks like useGetProductsQuery, useGetProductByIdQuery, etc.
