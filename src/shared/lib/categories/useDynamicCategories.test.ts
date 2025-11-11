import { renderHook } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { useDynamicCategories } from "./useDynamicCategories"

describe("useDynamicCategories", () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      title: "Product 1",
      price: 10.99,
      category: "electronics",
      description: "Description 1",
      image: "img1.jpg",
      rating: { rate: 4.5, count: 100 },
    },
    {
      id: 2,
      title: "Product 2",
      price: 20.99,
      category: "clothing",
      description: "Description 2",
      image: "img2.jpg",
      rating: { rate: 4.0, count: 50 },
    },
    {
      id: 3,
      title: "Product 3",
      price: 15.99,
      category: "electronics",
      description: "Description 3",
      image: "img3.jpg",
      rating: { rate: 4.8, count: 200 },
    },
  ]

  it("returns unique categories from products", () => {
    const { result } = renderHook(() => useDynamicCategories(mockProducts))

    // Order may vary based on Set iteration, so check contents
    expect(result.current).toHaveLength(2)
    expect(result.current).toContain("electronics")
    expect(result.current).toContain("clothing")
  })

  it("returns empty array when no products provided", () => {
    const { result } = renderHook(() => useDynamicCategories())

    expect(result.current).toEqual([])
  })

  it("memoizes result when products reference doesn't change", () => {
    const { result, rerender } = renderHook(() =>
      useDynamicCategories(mockProducts)
    )

    const firstResult = result.current

    // Rerender with same reference
    rerender()

    expect(result.current).toBe(firstResult) // Same reference
  })

  it("recalculates when products change", () => {
    const { result, rerender } = renderHook(
      ({ products }) => useDynamicCategories(products),
      {
        initialProps: { products: mockProducts },
      }
    )

    const firstResult = result.current

    // Rerender with different products
    const newProducts: Product[] = [
      {
        id: 4,
        title: "Product 4",
        price: 30.99,
        category: "books",
        description: "Description 4",
        image: "img4.jpg",
        rating: { rate: 5.0, count: 300 },
      },
    ]

    rerender({ products: newProducts })

    expect(result.current).not.toBe(firstResult) // Different reference
    expect(result.current).toEqual(["books"])
  })
})
