import { renderHook } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product/model"

import { useDynamicPriceRange } from "./useDynamicPriceRange"

describe("useDynamicPriceRange", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      title: "Product 1",
      price: 10.99,
      category: "electronics",
      description: "Description 1",
      image: "img1.jpg",
      rating: { rate: 4.5, count: 100 },
    },
    {
      id: "2",
      title: "Product 2",
      price: 25.5,
      category: "clothing",
      description: "Description 2",
      image: "img2.jpg",
      rating: { rate: 4.0, count: 50 },
    },
    {
      id: "3",
      title: "Product 3",
      price: 15.0,
      category: "electronics",
      description: "Description 3",
      image: "img3.jpg",
      rating: { rate: 4.8, count: 200 },
    },
  ]

  it("returns min and max price from products", () => {
    const { result } = renderHook(() => useDynamicPriceRange(mockProducts))

    expect(result.current).toEqual({
      min: 10.99,
      max: 25.5,
    })
  })

  it("returns undefined when no products provided", () => {
    const { result } = renderHook(() => useDynamicPriceRange())

    expect(result.current).toBeUndefined()
  })

  it("returns undefined when empty array provided", () => {
    const { result } = renderHook(() => useDynamicPriceRange([]))

    expect(result.current).toBeUndefined()
  })

  it("filters out invalid prices (NaN, Infinity, negative)", () => {
    const invalidProducts: Product[] = [
      {
        id: "1",
        title: "Valid 1",
        price: 50,
        category: "test",
        description: "test",
        image: "img1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: "2",
        title: "Valid 2",
        price: 100,
        category: "test",
        description: "test",
        image: "img2.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: "3",
        title: "Invalid NaN",
        price: NaN,
        category: "test",
        description: "test",
        image: "img3.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: "4",
        title: "Invalid Infinity",
        price: Infinity,
        category: "test",
        description: "test",
        image: "img4.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: "5",
        title: "Invalid Negative",
        price: -10,
        category: "test",
        description: "test",
        image: "img5.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ]

    const { result } = renderHook(() => useDynamicPriceRange(invalidProducts))

    // Only valid prices (50, 100) should be used
    expect(result.current).toEqual({
      min: 50,
      max: 100,
    })
  })

  it("returns undefined when all products have the same price", () => {
    const samePriceProducts: Product[] = [
      {
        id: "1",
        title: "Product 1",
        price: 50,
        category: "test",
        description: "test",
        image: "img1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
      {
        id: "2",
        title: "Product 2",
        price: 50,
        category: "test",
        description: "test",
        image: "img2.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ]

    const { result } = renderHook(() => useDynamicPriceRange(samePriceProducts))

    // Price range filter is meaningless when min === max
    expect(result.current).toBeUndefined()
  })

  it("returns undefined when all prices are invalid", () => {
    const invalidProducts: Product[] = [
      {
        id: "1",
        title: "Invalid",
        price: NaN,
        category: "test",
        description: "test",
        image: "img1.jpg",
        rating: { rate: 4.5, count: 100 },
      },
    ]

    const { result } = renderHook(() => useDynamicPriceRange(invalidProducts))

    expect(result.current).toBeUndefined()
  })

  it("memoizes result when products reference doesn't change", () => {
    const { result, rerender } = renderHook(() =>
      useDynamicPriceRange(mockProducts)
    )

    const firstResult = result.current

    rerender()

    expect(result.current).toBe(firstResult) // Same reference
  })

  it("recalculates when products change", () => {
    const { result, rerender } = renderHook(
      ({ products }) => useDynamicPriceRange(products),
      {
        initialProps: { products: mockProducts },
      }
    )

    const firstResult = result.current

    const newProducts: Product[] = [
      {
        id: "4",
        title: "Product 4",
        price: 100,
        category: "books",
        description: "Description 4",
        image: "img4.jpg",
        rating: { rate: 5.0, count: 300 },
      },
      {
        id: "5",
        title: "Product 5",
        price: 200,
        category: "books",
        description: "Description 5",
        image: "img5.jpg",
        rating: { rate: 5.0, count: 300 },
      },
    ]

    rerender({ products: newProducts })

    expect(result.current).not.toBe(firstResult) // Different reference
    expect(result.current).toEqual({ min: 100, max: 200 })
  })
})
