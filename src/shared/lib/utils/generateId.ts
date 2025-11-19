import { nanoid } from "nanoid"

/**
 * Generates a unique ID for locally created products
 * Uses nanoid for short, URL-safe, unique identifiers
 *
 * Format: "local_" + 10-character nanoid
 * Example: "local_V1StGXR8_Z"
 *
 * @returns Unique local product ID
 */
export function generateLocalProductId(): string {
  return `local_${nanoid(10)}`
}
