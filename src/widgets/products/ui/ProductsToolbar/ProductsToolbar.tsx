import { SearchInput } from "@/features/search"

type ProductsToolbarProps = {
  /** Available categories for filters (derived from products) */
  categories?: string[]
  /** Search query value */
  searchQuery: string
  /** Search query change handler */
  onSearchChange: (value: string) => void
}

export function ProductsToolbar({
  categories,
  searchQuery,
  onSearchChange,
}: ProductsToolbarProps) {
  return (
    <div>
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      {/* TODO: Implement filters */}
      {categories && categories.length > 0 && (
        <p>Available categories: {categories.join(", ")}</p>
      )}
    </div>
  )
}
