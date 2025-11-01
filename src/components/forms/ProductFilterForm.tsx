"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  type ProductFilter,
  productFilterSchema,
  ProductCategory,
} from "@/lib/validations/product";

interface ProductFilterFormProps {
  onFilter: (filters: ProductFilter) => void;
  className?: string;
}

export function ProductFilterForm({
  onFilter,
  className = "",
}: ProductFilterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFilter>({
    resolver: zodResolver(productFilterSchema),
    mode: "onChange",
  });

  const [isFiltering, setIsFiltering] = useState(false);

  const onSubmit = async (data: ProductFilter) => {
    try {
      setIsFiltering(true);
      onFilter(data);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleClear = () => {
    reset();
    onFilter({});
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 p-4 bg-gray-50 rounded-lg ${className}`}
    >
      <h3 className="text-lg font-medium text-gray-900">Filter Products</h3>

      {/* Search Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          {...register("search")}
          placeholder="Search by product name..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.search && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.search.message}
          </p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...register("category")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {ProductCategory.options.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Min Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("minPrice", { valueAsNumber: true })}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.minPrice && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.minPrice.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("maxPrice", { valueAsNumber: true })}
            placeholder="999.99"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.maxPrice && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.maxPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* In Stock Filter */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("inStock")}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">In stock only</span>
        </label>
        {errors.inStock && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.inStock.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isFiltering}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isFiltering ? "Filtering..." : "Apply Filters"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
