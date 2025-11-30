import type { Metadata } from "next"

/**
 * Centralized SEO configuration
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://prod-show-case.vercel.app"
const SITE_NAME = "Product Showcase"
const DESCRIPTION =
  "Modern product showcase built with Next.js 16, React 19, and Feature-Sliced Design."

/**
 * Root layout metadata
 */
export const rootMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Modern Next.js App`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | Modern Next.js App`,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
}

/**
 * Products page metadata
 */
export const productsMetadata: Metadata = {
  title: "Browse Products",
  description: "Explore product catalog with filters, search, and favorites.",
  openGraph: {
    title: `Browse Products | ${SITE_NAME}`,
    description: "Explore product catalog with filters, search, and favorites.",
    url: `${BASE_URL}/products`,
  },
}

/**
 * Generate metadata for product detail page
 */
export async function generateProductMetadata(id: string): Promise<Metadata> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      }
    }

    const product = await res.json()
    const description = product.description.slice(0, 160)

    return {
      title: product.title,
      description,
      openGraph: {
        title: `${product.title} | ${SITE_NAME}`,
        description,
        url: `${BASE_URL}/products/${id}`,
        images: [
          { url: product.image, width: 800, height: 800, alt: product.title },
        ],
      },
    }
  } catch {
    return {
      title: "Error",
      description: "Failed to load product information.",
    }
  }
}
