import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect, vi } from "vitest"

import { makeStore } from "@/shared/lib/store"

import { ProductsWidget } from "./ProductsWidget"

// Mock ProductFormDialogWidget
vi.mock("@/widgets/product-form-dialog", () => ({
  ProductFormDialogWidget: () => null,
}))

describe("ProductsWidget", () => {
  it("renders without crashing", () => {
    const store = makeStore()
    const { container } = render(
      <Provider store={store}>
        <ProductsWidget />
      </Provider>
    )

    expect(container).toBeTruthy()
  })
})
