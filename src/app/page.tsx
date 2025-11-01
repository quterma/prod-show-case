"use client";

import { useState } from "react";

import { CreateProductForm } from "@/components/forms/CreateProductForm";
import { ProductFilterForm } from "@/components/forms/ProductFilterForm";
import ProductsList from "@/components/ProductsList";
import { useCreateProductMutation } from "@/lib/services/productsApi";
import type {
  CreateProductInput,
  ProductFilter,
} from "@/lib/validations/product";

export default function HomePage() {
  const [createProduct] = useCreateProductMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleCreateProduct = async (productData: CreateProductInput) => {
    try {
      await createProduct(productData).unwrap();
      setShowCreateForm(false);
      setNotification({
        message: "Product created successfully!",
        type: "success",
      });
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        message: `Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleFilter = (filters: ProductFilter) => {
    setNotification({
      message: `Filters applied: ${
        Object.keys(filters)
          .filter((key) => filters[key as keyof ProductFilter])
          .join(", ") || "None"
      }`,
      type: "info",
    });
    setTimeout(() => setNotification(null), 2000);
    // In a real app, this would update query parameters or state
    // to filter the products list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Product Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Demonstrating RTK Query with React Hook Form integration
          </p>
        </header>

        {/* Notification */}
        {notification && (
          <div
            className={`p-4 rounded-md ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : notification.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Creation Form */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Create Product
              </h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {showCreateForm ? "Hide" : "Show"} Form
              </button>
            </div>

            {showCreateForm && (
              <CreateProductForm
                onSubmit={handleCreateProduct}
                onCancel={() => setShowCreateForm(false)}
              />
            )}
          </div>

          {/* Products List and Filter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Filter Products
              </h2>
              <ProductFilterForm onFilter={handleFilter} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Products
              </h2>
              <ProductsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
