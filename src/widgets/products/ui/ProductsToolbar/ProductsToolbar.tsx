// TODO: Implement ProductsToolbar component
// Include search and filters

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products) */
  categories?: string[]
}

export function ProductsToolbar({ categories }: ProductsToolbarProps) {
  return (
    <div>
      {/* TODO: Implement toolbar with search and filters */}
      <p>Products Toolbar - TODO</p>
      {categories && categories.length > 0 && (
        <p>Available categories: {categories.join(", ")}</p>
      )}
    </div>
  )
}
