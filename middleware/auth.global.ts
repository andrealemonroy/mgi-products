import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const { token, loadFromStorage } = useAuth()

  if (typeof window !== 'undefined' && token.value === null) {
    loadFromStorage()
  }

  const isLogin = to.path === '/login'
  const hasToken = Boolean(token.value)

  if (!hasToken && !isLogin) {
    return navigateTo('/login')
  }

  if (hasToken && isLogin) {
    return navigateTo('/products')
  }
})
