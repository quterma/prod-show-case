"use client"

import { useParams } from "next/navigation"

export default function EditProductPage() {
  const params = useParams<{ id: string }>()

  return (
    <div>
      <h1>Edit Product #{params.id}</h1>
      <p>Form placeholder - will be implemented in Stage 3</p>
    </div>
  )
}
