import type { ProductPayload } from '../types/products'

export type ProductFormErrors = Partial<Record<keyof ProductPayload, string>>

export function validateProductPayload(payload: ProductPayload): ProductFormErrors {
  const errors: ProductFormErrors = {}

  if (!payload.title.trim()) {
    errors.title = 'El nombre es obligatorio'
  }

  if (!payload.category.trim()) {
    errors.category = 'La categoria es obligatoria'
  }

  if (!payload.description.trim()) {
    errors.description = 'La descripcion es obligatoria'
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    errors.price = 'El precio debe ser mayor o igual a 0'
  }

  if (!Number.isInteger(payload.stock) || payload.stock < 0) {
    errors.stock = 'El stock debe ser un entero mayor o igual a 0'
  }

  if (payload.status !== 'ACTIVE' && payload.status !== 'INACTIVE') {
    errors.status = 'El estado no es valido'
  }

  return errors
}
