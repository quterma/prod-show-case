"use client";

import { useGetProductsQuery } from "@/lib/services/productsApi";

export default function ProductsList() {
  const {
    data: products,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-sm text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading products:</p>
        <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (isSuccess && products) {
    return (
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Products</h2>
          {isFetching && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              Fetching...
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-semibold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {product.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          RTK Query Status:{" "}
          {isLoading ? "Loading" : isSuccess ? "Success" : "Error"}
        </div>
      </div>
    );
  }

  return null;
}
