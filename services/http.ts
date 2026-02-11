import { useRuntimeConfig } from 'nuxt/app'
import { $fetch } from 'ofetch'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type HttpBody = BodyInit | Record<string, any> | null

type HttpOptions = {
  method?: HttpMethod
  body?: HttpBody
  token?: string
}

export type HttpError = {
  statusCode: number
  message: string
  data?: unknown
}

function normalizeError(error: unknown): HttpError {
  const fallback: HttpError = { statusCode: 500, message: 'Unexpected error' }

  if (typeof error === 'object' && error !== null) {
    const anyErr = error as { statusCode?: number; message?: string; data?: unknown }
    return {
      statusCode: anyErr.statusCode ?? 500,
      message: anyErr.message ?? fallback.message,
      data: anyErr.data,
    }
  }

  return fallback
}

function getApiBaseUrl(): string {
  const rawValue = useRuntimeConfig().public.apiBaseUrl
  const apiBaseUrl = typeof rawValue === 'string' ? rawValue : String(rawValue ?? '')

  if (apiBaseUrl.length === 0) {
    throw new Error('Missing NUXT_PUBLIC_API_BASE_URL in environment configuration')
  }

  return apiBaseUrl
}

export async function http<T>(path: string, opts?: HttpOptions) {
  try {
    return await $fetch<T>(path, {
      baseURL: getApiBaseUrl(),
      method: opts?.method ?? 'GET',
      body: opts?.body,
      headers: {
        ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      },
    })
  } catch (err) {
    throw normalizeError(err)
  }
}
