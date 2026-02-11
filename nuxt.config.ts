// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@services': new URL('./services', import.meta.url).pathname,
    '@models': new URL('./types', import.meta.url).pathname,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
  typescript: {
    strict: true,
  },
})
