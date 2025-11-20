import { renderHook, waitFor } from "@testing-library/react"
import { type ReactNode } from "react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import type { Product } from "@/entities/product"
import { makeStore } from "@/shared/lib/store"

import { setPage } from "../model/paginationSlice"

import { usePagination } from "./usePagination"

// Helper to create mock products
function createMockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: `Product ${i + 1}`,
    price: 10 + i,
    category: "test",
    image: `https://example.com/image${i + 1}.jpg`,
    description: `Description ${i + 1}`,
    rating: { rate: 4.5, count: 100 },
  }))
}

describe("usePagination", () => {
  // Helper to create wrapper with specific store
  function createWrapper(store: ReturnType<typeof makeStore>) {
    return function Wrapper({ children }: { children: ReactNode }) {
      return <Provider store={store}>{children}</Provider>
    }
  }

  it("returns paginated products and totalPages", () => {
    const store = makeStore()
    const mockProducts = createMockProducts(25) // 25 products = 3 pages (10 per page)

    const { result } = renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    expect(result.current.paginatedProducts).toHaveLength(10) // First page has 10 items
    expect(result.current.totalPages).toBe(3)
  })

  it("returns empty array when no products", () => {
    const store = makeStore()
    const mockProducts: Product[] = []

    const { result } = renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    expect(result.current.paginatedProducts).toHaveLength(0)
    expect(result.current.totalPages).toBe(0)
  })

  it("auto-corrects currentPage when it exceeds totalPages", async () => {
    const store = makeStore()
    const mockProducts = createMockProducts(15) // 15 products = 2 pages

    // Set page to 3 (out of bounds for 15 products)
    store.dispatch(setPage(3))

    renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    // Should auto-correct to page 2 (last valid page)
    await waitFor(() => {
      expect(store.getState().pagination.currentPage).toBe(2)
    })
  })

  it("auto-corrects to page 1 when currentPage far exceeds totalPages", async () => {
    const store = makeStore()
    const mockProducts = createMockProducts(5) // 5 products = 1 page

    // Set page to 10 (way out of bounds)
    store.dispatch(setPage(10))

    renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    // Should auto-correct to page 1 (last valid page)
    await waitFor(() => {
      expect(store.getState().pagination.currentPage).toBe(1)
    })
  })

  it("does not correct when currentPage is valid", async () => {
    const store = makeStore()
    const mockProducts = createMockProducts(25) // 3 pages

    // Set page to 2 (valid)
    store.dispatch(setPage(2))

    renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    // Should remain on page 2
    await waitFor(() => {
      expect(store.getState().pagination.currentPage).toBe(2)
    })
  })

  it("handles products count decrease (simulating deletion)", async () => {
    const store = makeStore()
    let mockProducts = createMockProducts(25) // 3 pages initially

    // Set to page 3
    store.dispatch(setPage(3))

    const { rerender } = renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    // Simulate deleting products - now only 15 products (2 pages)
    mockProducts = createMockProducts(15)

    rerender()

    // Should auto-correct to page 2
    await waitFor(() => {
      expect(store.getState().pagination.currentPage).toBe(2)
    })
  })

  it("does not correct when totalPages is 0", async () => {
    const store = makeStore()
    const mockProducts: Product[] = []

    // Set page to 3
    store.dispatch(setPage(3))

    renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    // Should NOT auto-correct (no data to paginate)
    // Page remains 3 until data arrives
    await waitFor(() => {
      expect(store.getState().pagination.currentPage).toBe(3)
    })
  })

  it("returns correct page slice based on currentPage", () => {
    const store = makeStore()
    const mockProducts = createMockProducts(25)

    // Go to page 2
    store.dispatch(setPage(2))

    const { result } = renderHook(() => usePagination(mockProducts), {
      wrapper: createWrapper(store),
    })

    // Page 2 should have products 11-20
    expect(result.current.paginatedProducts[0].title).toBe("Product 11")
    expect(result.current.paginatedProducts[9].title).toBe("Product 20")
  })
})
