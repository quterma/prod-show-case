import { describe, expect, it } from "vitest"

import type { Product } from "@/entities/product"

import type { LocalProductsState } from "../model"

import {
  addLocalProducts,
  applyProductPatches,
  mergeLocalProducts,
  removeDeletedProducts,
  sortProductsByTitle,
} from "./mergeLocalProducts"

// Test helpers
const createProduct = (id: string, title: string): Product => ({
  id,
  title,
  price: 100,
  description: "Test product",
  category: "test",
  image: "https://example.com/image.jpg",
  rating: { rate: 4.5, count: 100 },
})

describe("mergeLocalProducts utilities", () => {
  describe("removeDeletedProducts", () => {
    it("should remove products with IDs in removedProductIds", () => {
      const products = [
        createProduct("1", "Product 1"),
        createProduct("2", "Product 2"),
        createProduct("3", "Product 3"),
      ]
      const removedProductIds = ["2"]

      const result = removeDeletedProducts(products, removedProductIds)

      expect(result).toHaveLength(2)
      expect(result.find((p) => p.id === "2")).toBeUndefined()
    })

    it("should return all products when removedProductIds is empty", () => {
      const products = [createProduct("1", "Product 1")]

      const result = removeDeletedProducts(products, [])

      expect(result).toHaveLength(1)
    })

    it("should handle all products removed", () => {
      const products = [
        createProduct("1", "Product 1"),
        createProduct("2", "Product 2"),
      ]
      const removedProductIds = ["1", "2"]

      const result = removeDeletedProducts(products, removedProductIds)

      expect(result).toHaveLength(0)
    })
  })

  describe("applyProductPatches", () => {
    it("should override API product with local patch", () => {
      const products = [createProduct("1", "Original Title")]
      const localProductsById: LocalProductsState["localProductsById"] = {
        "1": createProduct("1", "Edited Title"),
      }

      const result = applyProductPatches(products, localProductsById)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe("Edited Title")
    })

    it("should handle multiple patches", () => {
      const products = [
        createProduct("1", "Product 1"),
        createProduct("2", "Product 2"),
        createProduct("3", "Product 3"),
      ]
      const localProductsById: LocalProductsState["localProductsById"] = {
        "1": createProduct("1", "Edited Product 1"),
        "3": createProduct("3", "Edited Product 3"),
      }

      const result = applyProductPatches(products, localProductsById)

      expect(result.find((p) => p.id === "1")?.title).toBe("Edited Product 1")
      expect(result.find((p) => p.id === "2")?.title).toBe("Product 2")
      expect(result.find((p) => p.id === "3")?.title).toBe("Edited Product 3")
    })

    it("should return unchanged products when no patches exist", () => {
      const products = [createProduct("1", "Product 1")]

      const result = applyProductPatches(products, {})

      expect(result).toEqual(products)
    })
  })

  describe("addLocalProducts", () => {
    it("should add local products (ID starts with local_) to the list", () => {
      const products = [createProduct("1", "API Product")]
      const localProductsById: LocalProductsState["localProductsById"] = {
        local_abc123: createProduct("local_abc123", "Local Product 1"),
        local_xyz789: createProduct("local_xyz789", "Local Product 2"),
      }

      const result = addLocalProducts(products, localProductsById)

      expect(result).toHaveLength(3)
      expect(result.find((p) => p.id === "local_abc123")).toBeDefined()
      expect(result.find((p) => p.id === "local_xyz789")).toBeDefined()
    })

    it("should handle only local products (no API products)", () => {
      const products: Product[] = []
      const localProductsById: LocalProductsState["localProductsById"] = {
        local_abc123: createProduct("local_abc123", "Local Product"),
      }

      const result = addLocalProducts(products, localProductsById)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("local_abc123")
    })

    it("should not add products without local_ prefix", () => {
      const products = [createProduct("1", "API Product")]
      const localProductsById: LocalProductsState["localProductsById"] = {
        "2": createProduct("2", "API Patch (should not be added)"),
      }

      const result = addLocalProducts(products, localProductsById)

      // Only original product, no new ones added
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("1")
    })
  })

  describe("sortProductsByTitle", () => {
    it("should sort products alphabetically by title (case-insensitive)", () => {
      const products = [
        createProduct("1", "Zebra"),
        createProduct("2", "apple"),
        createProduct("3", "Banana"),
      ]

      const result = sortProductsByTitle(products)

      expect(result[0].title).toBe("apple")
      expect(result[1].title).toBe("Banana")
      expect(result[2].title).toBe("Zebra")
    })

    it("should handle empty array", () => {
      const result = sortProductsByTitle([])

      expect(result).toHaveLength(0)
    })
  })

  describe("mergeLocalProducts (integration)", () => {
    it("should correctly apply all transformations", () => {
      const apiProducts = [
        createProduct("1", "Product 1"),
        createProduct("2", "Product 2"),
        createProduct("3", "Product 3"),
        createProduct("4", "Product 4"),
      ]
      const localProductsById: LocalProductsState["localProductsById"] = {
        "1": createProduct("1", "Edited Product 1"), // patch
        local_abc: createProduct("local_abc", "Local Product A"), // new local
        local_xyz: createProduct("local_xyz", "Local Product B"), // new local
      }
      const removedProductIds = ["3"] // remove Product 3

      const result = mergeLocalProducts(
        apiProducts,
        localProductsById,
        removedProductIds
      )

      // Should have: Product 1 (edited), Product 2, Product 4, Local A, Local B
      // Product 3 removed
      expect(result).toHaveLength(5)

      // Check Product 1 is edited
      expect(result.find((p) => p.id === "1")?.title).toBe("Edited Product 1")

      // Check Product 3 is removed
      expect(result.find((p) => p.id === "3")).toBeUndefined()

      // Check local products are added
      expect(result.find((p) => p.id === "local_abc")).toBeDefined()
      expect(result.find((p) => p.id === "local_xyz")).toBeDefined()

      // Check sorting (alphabetically)
      expect(result[0].title).toBe("Edited Product 1")
      expect(result[1].title).toBe("Local Product A")
      expect(result[2].title).toBe("Local Product B")
      expect(result[3].title).toBe("Product 2")
      expect(result[4].title).toBe("Product 4")
    })

    it("should handle empty inputs", () => {
      const result = mergeLocalProducts([], {}, [])

      expect(result).toHaveLength(0)
    })

    it("should handle scenario: all API products removed, only local remain", () => {
      const apiProducts = [
        createProduct("1", "Product 1"),
        createProduct("2", "Product 2"),
      ]
      const localProductsById: LocalProductsState["localProductsById"] = {
        local_abc: createProduct("local_abc", "Local Product"),
      }
      const removedProductIds = ["1", "2"]

      const result = mergeLocalProducts(
        apiProducts,
        localProductsById,
        removedProductIds
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("local_abc")
    })
  })
})
