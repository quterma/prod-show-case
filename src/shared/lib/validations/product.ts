/**
 * Parses and validates product ID from route params
 *
 * Valid ID rules:
 * - Must be a valid integer (no decimals, no NaN)
 * - Can be negative (for local products) or positive (for API products)
 * - Cannot be zero (reserved/invalid)
 * - Must be within safe integer range
 *
 * @param id - Raw ID string from route params
 * @returns Parsed number if valid, null otherwise
 *
 * @example
 * ```ts
 * const productId = parseProductId(params.id)
 * if (productId === null) {
 *   notFound()
 * }
 * ```
 */
export function parseProductId(id: string): number | null {
  const parsed = Number(id)

  // Invalid if: NaN, not integer, zero, or outside safe range
  if (
    Number.isNaN(parsed) ||
    !Number.isInteger(parsed) ||
    parsed === 0 ||
    !Number.isSafeInteger(parsed)
  ) {
    return null
  }

  return parsed
}
