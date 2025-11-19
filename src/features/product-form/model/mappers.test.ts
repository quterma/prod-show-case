import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { toFormData, fromFormData, createEmptyFormData } from "./mappers"
import type { ProductFormData } from "./types"

describe("product-form mappers", () => {
  const mockProduct: Product = {
    id: "1",
    title: "Test Product",
    price: 99.99,
    description: "Test description",
    category: "electronics",
    image: "https://example.com/image.jpg",
    rating: {
      rate: 4.5,
      count: 120,
    },
  }

  const mockFormData: ProductFormData = {
    title: "Test Product",
    price: 99.99,
    description: "Test description",
    category: "electronics",
    image: "https://example.com/image.jpg",
    rate: 4.5,
    count: 120,
  }

  describe("toFormData", () => {
    it("should convert Product to ProductFormData", () => {
      const result = toFormData(mockProduct)

      expect(result).toEqual(mockFormData)
    })

    it("should flatten rating object into rate and count fields", () => {
      const result = toFormData(mockProduct)

      expect(result.rate).toBe(mockProduct.rating.rate)
      expect(result.count).toBe(mockProduct.rating.count)
      expect(result).not.toHaveProperty("rating")
    })

    it("should preserve all other product fields", () => {
      const result = toFormData(mockProduct)

      expect(result.title).toBe(mockProduct.title)
      expect(result.price).toBe(mockProduct.price)
      expect(result.description).toBe(mockProduct.description)
      expect(result.category).toBe(mockProduct.category)
      expect(result.image).toBe(mockProduct.image)
    })
  })

  describe("fromFormData", () => {
    it("should convert ProductFormData to Product without ID", () => {
      const result = fromFormData(mockFormData)
      const expected = { ...mockProduct }
      delete (expected as Partial<Product>).id

      expect(result).toEqual(expected)
    })

    it("should combine rate and count into rating object", () => {
      const result = fromFormData(mockFormData)

      expect(result.rating).toEqual({
        rate: mockFormData.rate,
        count: mockFormData.count,
      })
      expect(result).not.toHaveProperty("rate")
      expect(result).not.toHaveProperty("count")
    })

    it("should not include ID in the result", () => {
      const result = fromFormData(mockFormData)

      expect(result).not.toHaveProperty("id")
    })

    it("should preserve all form fields in the product", () => {
      const result = fromFormData(mockFormData)

      expect(result.title).toBe(mockFormData.title)
      expect(result.price).toBe(mockFormData.price)
      expect(result.description).toBe(mockFormData.description)
      expect(result.category).toBe(mockFormData.category)
      expect(result.image).toBe(mockFormData.image)
    })
  })

  describe("createEmptyFormData", () => {
    it("should create empty form data with default values", () => {
      const result = createEmptyFormData()

      expect(result).toEqual({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rate: 0,
        count: 0,
      })
    })

    it("should create a new object on each call", () => {
      const first = createEmptyFormData()
      const second = createEmptyFormData()

      expect(first).not.toBe(second)
      expect(first).toEqual(second)
    })
  })

  describe("bidirectional mapping", () => {
    it("should maintain data integrity when converting back and forth", () => {
      const originalProduct = mockProduct

      // Product -> Form -> Product (without ID)
      const formData = toFormData(originalProduct)
      const convertedProductData = fromFormData(formData)
      const convertedProduct = {
        ...convertedProductData,
        id: originalProduct.id,
      }

      expect(convertedProduct).toEqual(originalProduct)
    })

    it("should handle zero values correctly", () => {
      const zeroProduct: Product = {
        ...mockProduct,
        price: 0,
        rating: { rate: 0, count: 0 },
      }

      const formData = toFormData(zeroProduct)
      const convertedProductData = fromFormData(formData)
      const convertedProduct = { ...convertedProductData, id: zeroProduct.id }

      expect(convertedProduct).toEqual(zeroProduct)
      expect(convertedProduct.price).toBe(0)
      expect(convertedProduct.rating.rate).toBe(0)
      expect(convertedProduct.rating.count).toBe(0)
    })
  })
})
