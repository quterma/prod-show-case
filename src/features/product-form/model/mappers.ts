import type { Product } from "@/entities/product/model"

import type { ProductFormData } from "./types"

/**
 * Maps a Product to form data for editing
 * Flattens the rating object into separate fields
 *
 * @param product - Domain Product model
 * @returns Form data object
 */
export function toFormData(product: Product): ProductFormData {
  return {
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    rate: product.rating.rate,
    count: product.rating.count,
  }
}

/**
 * Maps form data to Product model (without ID)
 * Combines rate and count into rating object
 * Use this to create product payload that can be used with ID assignment logic
 *
 * @param formData - Form data from user input
 * @returns Product model without ID
 */
export function fromFormData(formData: ProductFormData): Omit<Product, "id"> {
  return {
    title: formData.title,
    price: formData.price,
    description: formData.description,
    category: formData.category,
    image: formData.image,
    rating: {
      rate: formData.rate,
      count: formData.count,
    },
  }
}

/**
 * Creates empty form data for new product creation
 * Sets sensible defaults for all fields
 *
 * @returns Empty form data with defaults
 */
export function createEmptyFormData(): ProductFormData {
  return {
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
    rate: 0,
    count: 0,
  }
}
