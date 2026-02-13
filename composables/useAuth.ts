import { computed } from 'vue'
import { useState } from 'nuxt/app'
import type { LoginPayload } from '../types/auth'
import { loginService } from '../services/auth.service'

export function useAuth() {
  const token = useState<string | null>('auth_token', () => null)
  const isAuthenticated = computed(() => Boolean(token.value))

  function loadFromStorage() {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('auth_token')
    token.value = stored ?? null
  }

  function saveToStorage(newToken: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', newToken)
    token.value = newToken
  }

  function clear() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
    token.value = null
  }

  async function login(payload: LoginPayload) {
    const res = await loginService(payload)
    saveToStorage(res.accessToken)
    return res
  }

  return {
    token,
    isAuthenticated,
    loadFromStorage,
    login,
    logout: clear,
  }
}
