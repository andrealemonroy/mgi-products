export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: '.',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
  typescript: {
    strict: true,
  },
})
