import { baseApi } from "./baseApi";

// Product type definition matching our validation schema
export interface Product {
  id: number;
  name: string;
  price: number;
  category: "electronics" | "clothing" | "books" | "home" | "sports" | "other";
  description?: string;
  inStock: boolean;
}

// Input types for mutations
export interface CreateProductInput {
  name: string;
  price: number;
  category: Product["category"];
  description?: string;
  inStock: boolean;
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  price?: number;
  category?: Product["category"];
  description?: string;
  inStock?: boolean;
}

// In-memory storage for demo (in real app, this would be handled by backend)
const productsStorage: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    category: "electronics",
    description: "High-quality wireless headphones with noise cancellation",
    inStock: true,
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 19.99,
    category: "clothing",
    description: "Comfortable cotton t-shirt in various colors",
    inStock: true,
  },
  {
    id: 3,
    name: "JavaScript Guide",
    price: 29.99,
    category: "books",
    description: "Complete guide to modern JavaScript development",
    inStock: false,
  },
];

let nextId = 4;

// Extend the base API with products endpoints
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: [...productsStorage] };
      },
      providesTags: ["Product"],
    }),

    getProduct: builder.query<Product, number>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const product = productsStorage.find((p) => p.id === id);
        return product
          ? { data: product }
          : { error: { status: 404, data: "Product not found" } };
      },
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    // Mutation endpoints
    createProduct: builder.mutation<Product, CreateProductInput>({
      queryFn: async (productData) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const newProduct: Product = {
          ...productData,
          id: nextId++,
        };

        productsStorage.push(newProduct);
        return { data: newProduct };
      },
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<Product, UpdateProductInput>({
      queryFn: async ({ id, ...updates }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const index = productsStorage.findIndex((p) => p.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Product not found" } };
        }

        productsStorage[index] = { ...productsStorage[index], ...updates };
        return { data: productsStorage[index] };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, number>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const index = productsStorage.findIndex((p) => p.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Product not found" } };
        }

        productsStorage.splice(index, 1);
        return { data: { success: true } };
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
