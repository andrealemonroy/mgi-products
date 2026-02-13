import { describe, expect, it } from 'vitest'
import { getProductStatus, sortByPrice } from '../utils/products'
import { validateProductPayload } from '../utils/product-form'
import type { Product } from '../types/products'

describe('products utils', () => {
  it('returns fallback status based on stock', () => {
    const withStock = { id: 1, title: 'A', description: 'A', category: 'cat', price: 10, stock: 5, thumbnail: '' } satisfies Product
    const withoutStock = { id: 2, title: 'B', description: 'B', category: 'cat', price: 10, stock: 0, thumbnail: '' } satisfies Product

    expect(getProductStatus(withStock)).toBe('ACTIVE')
    expect(getProductStatus(withoutStock)).toBe('INACTIVE')
  })

  it('respects explicit status over stock', () => {
    const product = {
      id: 1,
      title: 'A',
      description: 'A',
      category: 'cat',
      price: 10,
      stock: 0,
      thumbnail: '',
      status: 'ACTIVE',
    } satisfies Product

    expect(getProductStatus(product)).toBe('ACTIVE')
  })

  it('sorts products by price asc and desc', () => {
    const products = [
      { id: 1, title: 'A', description: '', category: 'cat', price: 30, stock: 2, thumbnail: '' },
      { id: 2, title: 'B', description: '', category: 'cat', price: 10, stock: 2, thumbnail: '' },
      { id: 3, title: 'C', description: '', category: 'cat', price: 20, stock: 2, thumbnail: '' },
    ] satisfies Product[]

    expect(sortByPrice(products, 'asc').map((p) => p.id)).toEqual([2, 3, 1])
    expect(sortByPrice(products, 'desc').map((p) => p.id)).toEqual([1, 3, 2])
  })
})

describe('product form validation', () => {
  it('returns errors for invalid payload', () => {
    const result = validateProductPayload({
      title: ' ',
      category: ' ',
      price: -2,
      stock: -1,
      description: ' ',
      status: 'ACTIVE',
    })

    expect(result.title).toBeTruthy()
    expect(result.category).toBeTruthy()
    expect(result.price).toBeTruthy()
    expect(result.stock).toBeTruthy()
    expect(result.description).toBeTruthy()
  })

  it('returns empty errors for valid payload', () => {
    const result = validateProductPayload({
      title: 'Mouse',
      category: 'Accessories',
      price: 20,
      stock: 3,
      description: 'Wireless mouse',
      status: 'ACTIVE',
    })

    expect(Object.keys(result)).toHaveLength(0)
  })
})
