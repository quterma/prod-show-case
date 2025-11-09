import { baseApi } from "@/shared/api"

import { mapProductDTO, mapProductsDTO } from "../model/mappers"
import type { Product, ProductDTO, ProductsListDTO } from "../model/types"

/**
 * Products API endpoints
 * Injected into base API for cache management
 */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all products from FakeStore API
     * Returns mapped domain models
     */
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ProductsListDTO) =>
        mapProductsDTO(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    /**
     * Get single product by ID from FakeStore API
     * Returns mapped domain model
     */
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ProductDTO) => mapProductDTO(response),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
})

// Export hooks for use in components
export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi
