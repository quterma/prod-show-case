import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { filterBySearch } from "./filterProducts"

describe("filterBySearch", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      title: "iPhone 14 Pro",
      price: 999,
      category: "electronics",
      description: "Latest Apple smartphone with advanced features",
      image: "img1.jpg",
      rating: { rate: 4.8, count: 200 },
    },
    {
      id: "2",
      title: "Samsung Galaxy S23",
      price: 899,
      category: "electronics",
      description: "Powerful Android phone",
      image: "img2.jpg",
      rating: { rate: 4.5, count: 150 },
    },
    {
      id: "3",
      title: "Nike Air Max",
      price: 120,
      category: "clothing",
      description: "Comfortable running shoes",
      image: "img3.jpg",
      rating: { rate: 4.2, count: 80 },
    },
  ]

  it("returns all products when query is empty", () => {
    expect(filterBySearch(mockProducts, "")).toEqual(mockProducts)
    expect(filterBySearch(mockProducts, "   ")).toEqual(mockProducts)
  })

  it("filters by title (case-insensitive)", () => {
    const result = filterBySearch(mockProducts, "iphone")
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("iPhone 14 Pro")
  })

  it("filters by description (case-insensitive)", () => {
    const result = filterBySearch(mockProducts, "android")
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Samsung Galaxy S23")
  })

  it("returns multiple matches", () => {
    const result = filterBySearch(mockProducts, "phone")
    expect(result).toHaveLength(2)
  })

  it("returns empty array when no matches", () => {
    const result = filterBySearch(mockProducts, "laptop")
    expect(result).toHaveLength(0)
  })
})
