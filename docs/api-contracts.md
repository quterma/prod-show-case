# FakeStore API Contracts

## Base URL

`https://fakestoreapi.com`

## Endpoints

### GET /products

Returns an array of all products.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use...",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    "rating": {
      "rate": 3.9,
      "count": 120
    }
  }
  // ... more products
]
```

### GET /products/:id

Returns a single product by ID.

**Response:** `200 OK`

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  "price": 109.95,
  "description": "Your perfect pack for everyday use...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  "rating": {
    "rate": 3.9,
    "count": 120
  }
}
```

## Field Types

### Product Object

| Field         | Type     | Description                         | Example                                     |
| ------------- | -------- | ----------------------------------- | ------------------------------------------- |
| `id`          | `number` | Unique product identifier (integer) | `1`                                         |
| `title`       | `string` | Product name                        | `"Fjallraven - Foldsack No. 1 Backpack..."` |
| `price`       | `number` | Price in USD (float)                | `109.95`                                    |
| `description` | `string` | Product description                 | `"Your perfect pack for everyday use..."`   |
| `category`    | `string` | Product category (see below)        | `"men's clothing"`                          |
| `image`       | `string` | Image URL                           | `"https://fakestoreapi.com/img/..."`        |
| `rating`      | `object` | Rating object (see below)           | `{ "rate": 3.9, "count": 120 }`             |

### Rating Object

| Field   | Type     | Description                 | Range         |
| ------- | -------- | --------------------------- | ------------- |
| `rate`  | `number` | Average rating (float)      | `0.0` - `5.0` |
| `count` | `number` | Number of reviews (integer) | `>= 0`        |

### Categories

Available category values (string enum):

- `"men's clothing"`
- `"women's clothing"`
- `"jewelery"`
- `"electronics"`

## Proposed TypeScript Types

### Minimal Domain Types for MVP

```typescript
/**
 * Product rating information
 */
export type ProductRating = {
  /** Average rating from 0 to 5 */
  rate: number
  /** Total number of reviews */
  count: number
}

/**
 * Product category enum
 */
export type ProductCategory =
  | "men's clothing"
  | "women's clothing"
  | "jewelery"
  | "electronics"

/**
 * Product entity (API response shape)
 */
export type Product = {
  /** Unique product ID */
  id: number
  /** Product title/name */
  title: string
  /** Price in USD */
  price: number
  /** Product description */
  description: string
  /** Product category */
  category: ProductCategory
  /** Product image URL */
  image: string
  /** Product rating information */
  rating: ProductRating
}

/**
 * API response for GET /products
 */
export type ProductsListResponse = Product[]

/**
 * API response for GET /products/:id
 */
export type ProductDetailResponse = Product
```

## Data Observations

### Price Range

- Minimum: `$7.95`
- Maximum: `$999.99`
- Most products: `$10` - `$100`

### Rating Range

- Rate: `1.9` - `4.8` (out of 5)
- Count: `70` - `679` reviews

### Total Products

- 20 products in the catalog (as of audit date)

### Category Distribution

- `electronics`: 6 products
- `men's clothing`: 4 products
- `women's clothing`: 6 products
- `jewelery`: 4 products

## Notes for Implementation

1. **Fallback Strategy**: On API error, use `mocks/products.json` with the same structure
2. **Client-side Operations**: All filtering, search, pagination done on frontend
3. **Type Safety**: Use `ProductCategory` type for strict category validation
4. **Price Formatting**: Display prices with 2 decimal places, USD symbol
5. **Image Loading**: Implement lazy loading for product images
6. **Rating Display**: Show stars visualization for `rating.rate`, count for `rating.count`
