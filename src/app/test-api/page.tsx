"use client"

import { useGetProductsQuery, useGetProductByIdQuery } from "@/entities/product"

/**
 * Smoke test page for Products API hooks
 * Tests that RTK Query hooks work correctly with FakeStore API
 */
export default function TestApiPage() {
  // Test getProducts hook
  const {
    data: products,
    isLoading: isLoadingList,
    error: errorList,
  } = useGetProductsQuery()

  // Test getProductById hook (fetch product with ID 1)
  const {
    data: product,
    isLoading: isLoadingById,
    error: errorById,
  } = useGetProductByIdQuery(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Smoke Test</h1>

      {/* Test 1: Get all products */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Test 1: useGetProductsQuery()
        </h2>
        {isLoadingList && <p className="text-blue-600">Loading products...</p>}
        {errorList && (
          <p className="text-red-600">Error: {JSON.stringify(errorList)}</p>
        )}
        {products && (
          <div>
            <p className="text-green-600 font-medium mb-2">
              ✅ Success! Loaded {products.length} products
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:underline">
                Show first 3 products (JSON)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(products.slice(0, 3), null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      {/* Test 2: Get product by ID */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Test 2: useGetProductByIdQuery(1)
        </h2>
        {isLoadingById && <p className="text-blue-600">Loading product...</p>}
        {errorById && (
          <p className="text-red-600">Error: {JSON.stringify(errorById)}</p>
        )}
        {product && (
          <div>
            <p className="text-green-600 font-medium mb-2">
              ✅ Success! Loaded product
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p>
                <strong>ID:</strong> {product.id}
              </p>
              <p>
                <strong>Title:</strong> {product.title}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Rating:</strong> {product.rating.rate} (
                {product.rating.count} reviews)
              </p>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:underline">
                Show full product (JSON)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(product, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>

      {/* Summary */}
      <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Summary</h3>
        <ul className="space-y-1">
          <li>
            {products ? "✅" : "⏳"} useGetProductsQuery() -{" "}
            {products ? "Working" : "Testing..."}
          </li>
          <li>
            {product ? "✅" : "⏳"} useGetProductByIdQuery(1) -{" "}
            {product ? "Working" : "Testing..."}
          </li>
        </ul>
        {products && product && (
          <p className="mt-4 text-green-700 font-medium">
            🎉 All API hooks are working correctly!
          </p>
        )}
      </section>
    </div>
  )
}
