import { z } from "zod"

// Common validation patterns that can be reused across forms
export const commonValidations = {
  // String validations
  requiredString: z.string().min(1, "This field is required"),
  optionalString: z.string().optional(),

  // Email validation (Zod v4 uses top-level z.email())
  email: z.email({ message: "Please enter a valid email address" }),

  // Number validations
  positiveNumber: z.number().positive("Must be a positive number"),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999, "Price too high"),

  // Date validations
  futureDate: z.date().refine((date) => date > new Date(), {
    message: "Date must be in the future",
  }),
}

// Generic form state
export const formStateSchema = z.object({
  isSubmitting: z.boolean().default(false),
  errors: z.record(z.string(), z.string()).default({}),
})

export type FormState = z.infer<typeof formStateSchema>
