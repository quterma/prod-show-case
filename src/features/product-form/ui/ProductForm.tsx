"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/Button"

import { productFormSchema } from "../model/schema"
import type { ProductFormData } from "../model/types"

import {
  TitleField,
  DescriptionField,
  PriceField,
  CategoryField,
  ImageField,
  RatingField,
  CountField,
} from "./fields"

type ProductFormProps = {
  /** Initial form data (for editing) or empty (for creating) */
  defaultValues: ProductFormData
  /** Submit handler - receives validated form data */
  onSubmit: (data: ProductFormData) => void | Promise<void>
  /** Cancel handler - called when user cancels form */
  onCancel: () => void
  /** Available categories for select dropdown */
  availableCategories: string[]
  /** Submit button text (default: "Save") */
  submitLabel?: string
  /** Cancel button text (default: "Cancel") */
  cancelLabel?: string
}

/**
 * Universal product form component
 * Works for both creating and editing products
 * Does not know about Redux, localStorage, or API - only handles form state and validation
 */
export function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  availableCategories,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <TitleField register={register} error={errors.title} />

      <PriceField
        register={register}
        setValue={setValue}
        error={errors.price}
      />

      <DescriptionField register={register} error={errors.description} />

      <CategoryField
        register={register}
        setValue={setValue}
        error={errors.category}
        availableCategories={availableCategories}
        defaultValue={defaultValues.category}
      />

      <ImageField register={register} error={errors.image} />

      <RatingField register={register} error={errors.rate} />

      <CountField register={register} error={errors.count} />

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      </div>
    </form>
  )
}
