import { describe, expect, it } from "vitest"

import type { Product } from "@/entities/product"
import type { LocalProductsState } from "@/features/local-products"

import { applyLocalChanges } from "./applyLocalChanges"

// Test helpers
const createProduct = (id: number, title: string): Product => ({
  id,
  title,
  price: 100,
  description: "Test product",
  category: "test",
  image: "https://example.com/image.jpg",
  rating: { rate: 4.5, count: 100 },
})

const createLocalEntry = (
  id: number,
  title: string,
  source: "local" | "api"
): LocalProductsState["localProductsById"][number] => ({
  id,
  data: createProduct(id, title),
  source,
})

describe("applyLocalChanges", () => {
  describe("Step 1: Filter removed products", () => {
    it("should remove products with IDs in removedApiIds", () => {
      const apiProducts = [
        createProduct(1, "Product 1"),
        createProduct(2, "Product 2"),
        createProduct(3, "Product 3"),
      ]
      const removedApiIds = [2]

      const result = applyLocalChanges(apiProducts, {}, removedApiIds)

      expect(result).toHaveLength(2)
      expect(result.find((p) => p.id === 2)).toBeUndefined()
    })

    it("should handle empty removedApiIds", () => {
      const apiProducts = [createProduct(1, "Product 1")]

      const result = applyLocalChanges(apiProducts, {}, [])

      expect(result).toHaveLength(1)
    })

    it("should handle all products removed", () => {
      const apiProducts = [
        createProduct(1, "Product 1"),
        createProduct(2, "Product 2"),
      ]
      const removedApiIds = [1, 2]

      const result = applyLocalChanges(apiProducts, {}, removedApiIds)

      expect(result).toHaveLength(0)
    })
  })

  describe("Step 2: Apply patches from localProductsById", () => {
    it("should override API product with local patch (source=api)", () => {
      const apiProducts = [createProduct(1, "Original Title")]
      const localProductsById = {
        1: createLocalEntry(1, "Edited Title", "api"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe("Edited Title")
    })

    it("should not override if local entry has source=local (handled in step 3)", () => {
      const apiProducts = [createProduct(1, "Original Title")]
      const localProductsById = {
        1: createLocalEntry(1, "Should Not Override", "local"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      // API product stays as-is, local product will be added in step 3
      expect(
        result.find((p) => p.id === 1 && p.title === "Original Title")
      ).toBeDefined()
    })

    it("should handle multiple patches", () => {
      const apiProducts = [
        createProduct(1, "Product 1"),
        createProduct(2, "Product 2"),
        createProduct(3, "Product 3"),
      ]
      const localProductsById = {
        1: createLocalEntry(1, "Edited Product 1", "api"),
        3: createLocalEntry(3, "Edited Product 3", "api"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      expect(result.find((p) => p.id === 1)?.title).toBe("Edited Product 1")
      expect(result.find((p) => p.id === 2)?.title).toBe("Product 2")
      expect(result.find((p) => p.id === 3)?.title).toBe("Edited Product 3")
    })
  })

  describe("Step 3: Add locally created products", () => {
    it("should add local products (source=local) to the list", () => {
      const apiProducts = [createProduct(1, "API Product")]
      const localProductsById = {
        [-1]: createLocalEntry(-1, "Local Product 1", "local"),
        [-2]: createLocalEntry(-2, "Local Product 2", "local"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      expect(result).toHaveLength(3)
      expect(result.find((p) => p.id === -1)).toBeDefined()
      expect(result.find((p) => p.id === -2)).toBeDefined()
    })

    it("should handle only local products (no API products)", () => {
      const apiProducts: Product[] = []
      const localProductsById = {
        [-1]: createLocalEntry(-1, "Local Product", "local"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(-1)
    })

    it("should not duplicate products with source=local", () => {
      const apiProducts: Product[] = []
      const localProductsById = {
        [-1]: createLocalEntry(-1, "Local Product", "local"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      const localProductCount = result.filter((p) => p.id === -1).length
      expect(localProductCount).toBe(1)
    })
  })

  describe("Step 4: Sort alphabetically", () => {
    it("should sort products alphabetically by title (case-insensitive)", () => {
      const apiProducts = [
        createProduct(1, "Zebra"),
        createProduct(2, "apple"),
        createProduct(3, "Banana"),
      ]

      const result = applyLocalChanges(apiProducts, {}, [])

      expect(result[0].title).toBe("apple")
      expect(result[1].title).toBe("Banana")
      expect(result[2].title).toBe("Zebra")
    })

    it("should sort local and API products together", () => {
      const apiProducts = [createProduct(1, "Zebra")]
      const localProductsById = {
        [-1]: createLocalEntry(-1, "Apple", "local"),
        [-2]: createLocalEntry(-2, "Banana", "local"),
      }

      const result = applyLocalChanges(apiProducts, localProductsById, [])

      expect(result[0].title).toBe("Apple")
      expect(result[1].title).toBe("Banana")
      expect(result[2].title).toBe("Zebra")
    })
  })

  describe("Integration: All steps combined", () => {
    it("should correctly apply all transformations", () => {
      const apiProducts = [
        createProduct(1, "Product 1"),
        createProduct(2, "Product 2"),
        createProduct(3, "Product 3"),
        createProduct(4, "Product 4"),
      ]
      const localProductsById = {
        1: createLocalEntry(1, "Edited Product 1", "api"), // patch
        [-1]: createLocalEntry(-1, "Local Product A", "local"), // new local
        [-2]: createLocalEntry(-2, "Local Product B", "local"), // new local
      }
      const removedApiIds = [3] // remove Product 3

      const result = applyLocalChanges(
        apiProducts,
        localProductsById,
        removedApiIds
      )

      // Should have: Product 1 (edited), Product 2, Product 4, Local A, Local B
      // Product 3 removed
      expect(result).toHaveLength(5)

      // Check Product 1 is edited
      expect(result.find((p) => p.id === 1)?.title).toBe("Edited Product 1")

      // Check Product 3 is removed
      expect(result.find((p) => p.id === 3)).toBeUndefined()

      // Check local products are added
      expect(result.find((p) => p.id === -1)).toBeDefined()
      expect(result.find((p) => p.id === -2)).toBeDefined()

      // Check sorting (alphabetically)
      expect(result[0].title).toBe("Edited Product 1")
      expect(result[1].title).toBe("Local Product A")
      expect(result[2].title).toBe("Local Product B")
      expect(result[3].title).toBe("Product 2")
      expect(result[4].title).toBe("Product 4")
    })

    it("should handle empty inputs", () => {
      const result = applyLocalChanges([], {}, [])

      expect(result).toHaveLength(0)
    })

    it("should handle scenario: all API products removed, only local remain", () => {
      const apiProducts = [
        createProduct(1, "Product 1"),
        createProduct(2, "Product 2"),
      ]
      const localProductsById = {
        [-1]: createLocalEntry(-1, "Local Product", "local"),
      }
      const removedApiIds = [1, 2]

      const result = applyLocalChanges(
        apiProducts,
        localProductsById,
        removedApiIds
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(-1)
    })
  })
})
