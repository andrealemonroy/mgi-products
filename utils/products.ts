import type { Product, ProductStatus } from '../types/products'

export function getProductStatus(product: Product): ProductStatus {
  if (product.status === 'ACTIVE' || product.status === 'INACTIVE') {
    return product.status
  }

  return product.stock > 0 ? 'ACTIVE' : 'INACTIVE'
}

export function sortByPrice(products: Product[], direction: 'asc' | 'desc') {
  return [...products].sort((a, b) => {
    return direction === 'asc' ? a.price - b.price : b.price - a.price
  })
}
