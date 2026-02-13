import type { Product, ProductPayload, ProductsListResponse } from '../types/products'
import { http } from './http'

export async function getProductsService() {
  return await http<ProductsListResponse>('/products')
}

export async function searchProductsService(query: string) {
  return await http<ProductsListResponse>(`/products/search?q=${encodeURIComponent(query)}`)
}

export async function getProductByIdService(id: number) {
  return await http<Product>(`/products/${id}`)
}

export async function createProductService(payload: ProductPayload, token?: string) {
  return await http<Product>('/products/add', {
    method: 'POST',
    body: payload,
    token,
  })
}

export async function updateProductService(id: number, payload: ProductPayload, token?: string) {
  return await http<Product>(`/products/${id}`, {
    method: 'PUT',
    body: payload,
    token,
  })
}
