"use client"

import { useMemo } from "react"

import type { Product } from "@/entities/product"
import { upsertLocalProduct } from "@/features/local-products"
import {
  ProductForm,
  toFormData,
  fromFormData,
  createEmptyFormData,
  type ProductFormData,
} from "@/features/product-form"
import { useAppDispatch } from "@/shared/lib/store"
import { Modal } from "@/shared/ui"

import { useAvailableCategories } from "../hooks"
import { createProductPayload, updateProductPayload } from "../lib/helpers"

type ProductFormDialogWidgetProps = {
  /** Dialog mode: create new product or edit existing */
  mode: "create" | "edit"
  /** Product to edit (required for edit mode) */
  product?: Product
  /** Controls dialog visibility */
  open: boolean
  /** Called when dialog should close */
  onCloseDialog: () => void
}

/**
 * Product form dialog widget (Smart Widget)
 * Handles create/edit logic and integrates with Redux store
 * - Create mode: creates new local product with auto-generated ID
 * - Edit mode: updates existing product (local or API override)
 * - Self-contained: handles data fetching and state management
 */
export function ProductFormDialogWidget({
  mode,
  product,
  open,
  onCloseDialog,
}: ProductFormDialogWidgetProps) {
  const dispatch = useAppDispatch()

  // Get available categories from aggregator hook
  const categories = useAvailableCategories()

  // Compute default values based on mode
  const defaultValues = useMemo<ProductFormData>(() => {
    if (mode === "edit" && product) {
      return toFormData(product)
    }
    return createEmptyFormData()
  }, [mode, product])

  // Compute modal title
  const title = mode === "create" ? "Create Product" : "Edit Product"

  // Handle form submission
  const handleSubmit = (formData: ProductFormData) => {
    const productData = fromFormData(formData)

    if (mode === "create") {
      // Create new local product (ID will be auto-assigned)
      const payload = createProductPayload(productData)
      dispatch(upsertLocalProduct(payload))
    } else if (mode === "edit" && product) {
      // Update existing product
      const payload = updateProductPayload(productData, product.id)
      dispatch(upsertLocalProduct(payload))
    }

    // Close dialog after successful submit
    onCloseDialog()
  }

  const handleCancel = () => {
    onCloseDialog()
  }

  return (
    <Modal open={open} onCloseDialog={onCloseDialog} title={title}>
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        availableCategories={categories}
        submitLabel={mode === "create" ? "Create" : "Save"}
      />
    </Modal>
  )
}
