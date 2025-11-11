import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { describe, it, expect } from "vitest"

import { makeStore } from "@/shared/lib/store"

import { ProductDetailWidget } from "./ProductDetailWidget"

describe("ProductDetailWidget", () => {
  it("renders without crashing", () => {
    const store = makeStore()
    const { container } = render(
      <Provider store={store}>
        <ProductDetailWidget productId={1} />
      </Provider>
    )

    expect(container).toBeTruthy()
  })
})
