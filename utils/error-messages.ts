export type ErrorContext =
  | 'login'
  | 'productsList'
  | 'productCreate'
  | 'productDetail'
  | 'productEditLoad'
  | 'productUpdate'

const defaultMessages: Record<ErrorContext, string> = {
  login: 'No se pudo iniciar sesion. Verifica tus credenciales.',
  productsList: 'No se pudieron cargar los productos.',
  productCreate: 'No se pudo crear el producto.',
  productDetail: 'No se pudo cargar el detalle del producto.',
  productEditLoad: 'No se pudieron cargar los datos del producto.',
  productUpdate: 'No se pudo actualizar el producto.',
}

const statusMessages: Partial<Record<ErrorContext, Partial<Record<number, string>>>> = {
  login: {
    400: 'Credenciales invalidas. Intenta nuevamente.',
    401: 'No autorizado. Inicia sesion nuevamente.',
  },
  productsList: {
    401: 'Tu sesion expiro. Inicia sesion nuevamente.',
    500: 'Servicio no disponible temporalmente.',
  },
  productCreate: {
    400: 'Datos invalidos. Revisa el formulario.',
    401: 'Tu sesion expiro. Inicia sesion nuevamente.',
  },
  productDetail: {
    404: 'Producto no encontrado.',
    500: 'No fue posible obtener el detalle.',
  },
  productEditLoad: {
    404: 'Producto no encontrado.',
    500: 'No fue posible cargar el producto para editar.',
  },
  productUpdate: {
    400: 'Datos invalidos. Revisa el formulario.',
    404: 'Producto no encontrado.',
    401: 'Tu sesion expiro. Inicia sesion nuevamente.',
  },
}

function extractStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  const maybeStatus = (error as { statusCode?: unknown }).statusCode
  return typeof maybeStatus === 'number' ? maybeStatus : undefined
}

export function getUserFacingErrorMessage(error: unknown, context: ErrorContext): string {
  const statusCode = extractStatusCode(error)
  if (statusCode) {
    const scoped = statusMessages[context]?.[statusCode]
    if (scoped) {
      return scoped
    }
  }

  return defaultMessages[context]
}
