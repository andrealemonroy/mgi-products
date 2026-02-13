import { describe, expect, it } from 'vitest'
import { getUserFacingErrorMessage } from '../utils/error-messages'

describe('error message strategy', () => {
  it('maps known login status codes', () => {
    expect(getUserFacingErrorMessage({ statusCode: 400 }, 'login')).toBe(
      'Credenciales invalidas. Intenta nuevamente.',
    )
    expect(getUserFacingErrorMessage({ statusCode: 401 }, 'login')).toBe(
      'No autorizado. Inicia sesion nuevamente.',
    )
  })

  it('returns fallback for unknown statuses', () => {
    expect(getUserFacingErrorMessage({ statusCode: 418 }, 'productUpdate')).toBe(
      'No se pudo actualizar el producto.',
    )
  })

  it('does not expose backend message when status is absent', () => {
    expect(getUserFacingErrorMessage({ message: 'raw backend message' }, 'productsList')).toBe(
      'No se pudieron cargar los productos.',
    )
  })
})
