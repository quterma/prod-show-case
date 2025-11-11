import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { getDynamicCategories } from "./getDynamicCategories"

describe("getDynamicCategories", () => {
  it("extracts unique categories from products array", () => {
    const products: Product[] = [
      {
        id: 1,
        title: "Product 1",
        price: 100,
        description: "Description 1",
        category: "electronics",
        image: "image1.jpg",
        rating: { rate: 4.5, count: 10 },
      },
      {
        id: 2,
        title: "Product 2",
        price: 200,
        description: "Description 2",
        category: "jewelery",
        image: "image2.jpg",
        rating: { rate: 4.0, count: 5 },
      },
      {
        id: 3,
        title: "Product 3",
        price: 150,
        description: "Description 3",
        category: "electronics",
        image: "image3.jpg",
        rating: { rate: 4.8, count: 15 },
      },
    ]

    const categories = getDynamicCategories(products)

    expect(categories).toEqual(["electronics", "jewelery"])
  })

  it("returns empty array for empty products array", () => {
    const categories = getDynamicCategories([])

    expect(categories).toEqual([])
  })

  it("sorts categories alphabetically", () => {
    const products: Product[] = [
      {
        id: 1,
        title: "Product 1",
        price: 100,
        description: "Description 1",
        category: "women's clothing",
        image: "image1.jpg",
        rating: { rate: 4.5, count: 10 },
      },
      {
        id: 2,
        title: "Product 2",
        price: 200,
        description: "Description 2",
        category: "electronics",
        image: "image2.jpg",
        rating: { rate: 4.0, count: 5 },
      },
      {
        id: 3,
        title: "Product 3",
        price: 150,
        description: "Description 3",
        category: "men's clothing",
        image: "image3.jpg",
        rating: { rate: 4.8, count: 15 },
      },
    ]

    const categories = getDynamicCategories(products)

    expect(categories).toEqual([
      "electronics",
      "men's clothing",
      "women's clothing",
    ])
  })

  it("handles single product with single category", () => {
    const products: Product[] = [
      {
        id: 1,
        title: "Product 1",
        price: 100,
        description: "Description 1",
        category: "electronics",
        image: "image1.jpg",
        rating: { rate: 4.5, count: 10 },
      },
    ]

    const categories = getDynamicCategories(products)

    expect(categories).toEqual(["electronics"])
  })
})
