import { z } from "zod"

/**
 * Validation schema for product form
 * Defines validation rules for all product form fields
 */
export const productFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999, "Price is too high"),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),

  category: z.string().min(1, "Category is required"),

  image: z.string().min(1, "Image URL is required"),

  rate: z
    .number()
    .min(0, "Rating cannot be less than 0")
    .max(5, "Rating cannot be greater than 5"),

  count: z
    .number()
    .int("Review count must be an integer")
    .min(0, "Review count cannot be negative"),
})

/**
 * Inferred type from schema (should match ProductFormData)
 */
export type ProductFormSchema = z.infer<typeof productFormSchema>
