import type { Product, ProductPayload } from '../types/products'

const STORAGE_KEY = 'mgi_local_products'
const DEFAULT_THUMBNAIL = 'https://placehold.co/120x120?text=Product'

function isClient() {
  return typeof window !== 'undefined'
}

function safeParseProducts(raw: string | null): Product[] {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Product[]) : []
  } catch {
    return []
  }
}

function writeLocalProducts(products: Product[]) {
  if (!isClient()) {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function matchesQuery(product: Product, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return [product.title, product.category, product.description].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  )
}

export function getLocalProducts(): Product[] {
  if (!isClient()) {
    return []
  }

  return safeParseProducts(localStorage.getItem(STORAGE_KEY))
}

export function getLocalProductById(id: number): Product | undefined {
  return getLocalProducts().find((product) => product.id === id)
}

export function upsertLocalProduct(product: Product) {
  const current = getLocalProducts()
  const index = current.findIndex((item) => item.id === product.id)

  if (index === -1) {
    current.unshift(product)
  } else {
    current[index] = product
  }

  writeLocalProducts(current)
}

export function mergeProductsWithLocal(apiProducts: Product[], query = ''): Product[] {
  const map = new Map<number, Product>()

  apiProducts.forEach((product) => {
    map.set(product.id, product)
  })

  getLocalProducts().forEach((localProduct) => {
    const existing = map.get(localProduct.id)

    if (existing) {
      const merged = { ...existing, ...localProduct }
      if (matchesQuery(merged, query)) {
        map.set(localProduct.id, merged)
      } else {
        map.delete(localProduct.id)
      }
      return
    }

    if (matchesQuery(localProduct, query)) {
      map.set(localProduct.id, localProduct)
    }
  })

  return [...map.values()]
}

export function buildProductFromPayload(params: {
  id: number
  payload: ProductPayload
  existing?: Product
  apiProduct?: Partial<Product>
}): Product {
  const { id, payload, existing, apiProduct } = params

  return {
    id,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    stock: payload.stock,
    status: payload.status,
    thumbnail: apiProduct?.thumbnail ?? existing?.thumbnail ?? DEFAULT_THUMBNAIL,
    images: apiProduct?.images ?? existing?.images,
    brand: apiProduct?.brand ?? existing?.brand,
    rating: apiProduct?.rating ?? existing?.rating,
  }
}
