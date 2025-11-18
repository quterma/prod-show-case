/**
 * Product form data type
 * Separate from domain Product type - represents form state
 */
export type ProductFormData = {
  /** Product title/name */
  title: string
  /** Price in USD */
  price: number
  /** Product description */
  description: string
  /** Product category (single selection) */
  category: string
  /** Product image URL */
  image: string
  /** Rating rate (0-5) */
  rate: number
  /** Rating count (number of reviews) */
  count: number
}
