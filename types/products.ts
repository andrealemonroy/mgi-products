export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  stock: number
  thumbnail: string
  images?: string[]
  brand?: string
  rating?: number
  status?: ProductStatus
}

export type ProductsListResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type ProductPayload = {
  title: string
  category: string
  price: number
  stock: number
  description: string
  status: ProductStatus
}