<script setup lang="ts">
import ProductForm from '../../components/ProductForm.vue'
import type { ProductPayload } from '../../types/products'
import { createProductService } from '../../services/products.service'
import { getUserFacingErrorMessage } from '../../utils/error-messages'
import { buildProductFromPayload, upsertLocalProduct } from '../../utils/localProducts'

useSeoMeta({
  title: 'Nuevo producto | MGi Products',
  description: 'Crear producto',
})

const { token } = useAuth()

const loading = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit(payload: ProductPayload) {
  loading.value = true
  errorMessage.value = null

  try {
    const apiProduct = await createProductService(payload, token.value ?? undefined)
    const localProduct = buildProductFromPayload({
      id: apiProduct.id,
      payload,
      apiProduct,
    })

    upsertLocalProduct(localProduct)
    await navigateTo('/products')
  } catch (error: unknown) {
    errorMessage.value = getUserFacingErrorMessage(error, 'productCreate')
  } finally {
    loading.value = false
  }
}

function onCancel() {
  navigateTo('/products')
}
</script>

<template>
  <main class="form-page">
    <section class="card">
      <h1>Crear producto</h1>
      <ProductForm
        submit-label="Crear"
        :loading="loading"
        :error-message="errorMessage"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </section>
  </main>
</template>

<style scoped>
.form-page {
  max-width: 780px;
  margin: 24px auto;
  padding: 0 16px;
}

.card {
  border: 1px solid #e4e7ec;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}

h1 {
  margin: 0;
}
</style>
