import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  buildProductFromPayload,
  getLocalProductById,
  getLocalProducts,
  mergeProductsWithLocal,
  upsertLocalProduct,
} from '../utils/localProducts'
import type { Product } from '../types/products'

type MemoryStorage = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  clear: () => void
}

function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>()

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    clear() {
      store.clear()
    },
  }
}

function setClientEnv() {
  Object.defineProperty(globalThis, 'window', {
    value: {},
    writable: true,
    configurable: true,
  })

  Object.defineProperty(globalThis, 'localStorage', {
    value: createMemoryStorage(),
    writable: true,
    configurable: true,
  })
}

function unsetClientEnv() {
  Object.defineProperty(globalThis, 'window', {
    value: undefined,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(globalThis, 'localStorage', {
    value: undefined,
    writable: true,
    configurable: true,
  })
}

const apiProduct = {
  id: 1,
  title: 'Phone',
  description: 'Old description',
  category: 'electronics',
  price: 500,
  stock: 3,
  thumbnail: 'api-thumb',
} satisfies Product

describe('localProducts - SSR safety', () => {
  it('returns empty array on server environment', () => {
    unsetClientEnv()
    expect(getLocalProducts()).toEqual([])
  })
})

describe('localProducts - client cache', () => {
  beforeEach(() => {
    setClientEnv()
  })

  afterEach(() => {
    ;(globalThis.localStorage as MemoryStorage).clear()
  })

  it('upserts and retrieves product by id', () => {
    upsertLocalProduct(apiProduct)

    const all = getLocalProducts()
    expect(all).toHaveLength(1)
    expect(getLocalProductById(1)?.title).toBe('Phone')
  })

  it('replaces existing local product on upsert', () => {
    upsertLocalProduct(apiProduct)
    upsertLocalProduct({ ...apiProduct, title: 'Phone Updated' })

    const all = getLocalProducts()
    expect(all).toHaveLength(1)
    expect(all[0]?.title).toBe('Phone Updated')
  })

  it('merges api list with local overrides and additions', () => {
    upsertLocalProduct({ ...apiProduct, title: 'Phone Local' })
    upsertLocalProduct({
      id: 999,
      title: 'Local Only',
      description: 'Only local',
      category: 'custom',
      price: 99,
      stock: 2,
      thumbnail: 'local-thumb',
      status: 'ACTIVE',
    })

    const merged = mergeProductsWithLocal([apiProduct])
    expect(merged).toHaveLength(2)
    expect(merged.find((p) => p.id === 1)?.title).toBe('Phone Local')
    expect(merged.find((p) => p.id === 999)?.title).toBe('Local Only')
  })

  it('filters merged products by query', () => {
    upsertLocalProduct({ ...apiProduct, title: 'Special Laptop' })

    const merged = mergeProductsWithLocal([apiProduct], 'laptop')
    expect(merged).toHaveLength(1)
    expect(merged[0]?.title).toBe('Special Laptop')
  })

  it('builds product payload preserving existing visual fields', () => {
    const built = buildProductFromPayload({
      id: 7,
      payload: {
        title: 'Edited',
        category: 'cat',
        price: 11,
        stock: 4,
        description: 'new desc',
        status: 'ACTIVE',
      },
      existing: {
        id: 7,
        title: 'Old',
        description: 'old',
        category: 'old-cat',
        price: 1,
        stock: 1,
        thumbnail: 'existing-thumb',
        brand: 'BrandA',
      },
    })

    expect(built.thumbnail).toBe('existing-thumb')
    expect(built.brand).toBe('BrandA')
    expect(built.title).toBe('Edited')
  })
})
