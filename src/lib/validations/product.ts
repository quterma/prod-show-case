import { z } from "zod";

import { commonValidations } from "./common";

// Product category enum for type safety
export const ProductCategory = z.enum([
  "electronics",
  "clothing",
  "books",
  "home",
  "sports",
  "other",
]);

// Base product schema that matches our existing Product interface
export const productSchema = z.object({
  id: z.number(),
  name: commonValidations.requiredString,
  price: commonValidations.price,
  category: ProductCategory,
  description: z.string().optional(),
  inStock: z.boolean(),
});

// Schema for creating a new product (without ID)
export const createProductSchema = productSchema.omit({ id: true });

// Schema for updating a product (all fields optional except ID)
export const updateProductSchema = productSchema
  .partial()
  .extend({ id: z.number() });

// Schema for product filter form
export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: ProductCategory.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
});

// Type exports inferred from schemas
export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
export type ProductCategoryType = z.infer<typeof ProductCategory>;

// Validation helpers
export const validateCreateProduct = (data: unknown) => {
  return createProductSchema.safeParse(data);
};

export const validateProductFilter = (data: unknown) => {
  return productFilterSchema.safeParse(data);
};
