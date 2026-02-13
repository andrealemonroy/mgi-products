<script setup lang="ts">
import ProductForm from '../../../components/ProductForm.vue'
import type { ProductPayload } from '../../../types/products'
import { getProductByIdService, updateProductService } from '../../../services/products.service'
import { getUserFacingErrorMessage } from '../../../utils/error-messages'
import { getProductStatus } from '../../../utils/products'
import { buildProductFromPayload, getLocalProductById, upsertLocalProduct } from '../../../utils/localProducts'

const route = useRoute()
const productId = computed(() => Number(route.params.id))

if (Number.isNaN(productId.value)) {
  throw createError({ statusCode: 400, statusMessage: 'ID de producto invalido' })
}

useSeoMeta({
  title: 'Editar producto | MGi Products',
  description: 'Editar producto',
})

const { token } = useAuth()
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const { data, pending, error } = await useAsyncData(`edit-product-${productId.value}`, () => {
  return getProductByIdService(productId.value)
})

const localProduct = computed(() => getLocalProductById(productId.value))
const product = computed(() => localProduct.value ?? data.value)

const initialValue = computed<ProductPayload | undefined>(() => {
  if (!product.value) return undefined

  return {
    title: product.value.title,
    category: product.value.category,
    price: product.value.price,
    stock: product.value.stock,
    description: product.value.description,
    status: getProductStatus(product.value),
  }
})

const loadError = computed(() => {
  if (product.value) {
    return null
  }

  if (!error.value) {
    return null
  }

  return getUserFacingErrorMessage(error.value, 'productEditLoad')
})

async function onSubmit(payload: ProductPayload) {
  loading.value = true
  errorMessage.value = null

  try {
    const apiProduct = await updateProductService(productId.value, payload, token.value ?? undefined)
    const localUpdated = buildProductFromPayload({
      id: productId.value,
      payload,
      existing: product.value,
      apiProduct,
    })

    upsertLocalProduct(localUpdated)
    await navigateTo(`/products/${productId.value}`)
  } catch (submitError: unknown) {
    errorMessage.value = getUserFacingErrorMessage(submitError, 'productUpdate')
  } finally {
    loading.value = false
  }
}

function onCancel() {
  navigateTo(`/products/${productId.value}`)
}
</script>

<template>
  <main class="form-page">
    <section class="card">
      <h1>Editar producto</h1>

      <p v-if="pending && !product">Cargando datos del producto...</p>
      <p v-else-if="loadError" class="error">{{ loadError }}</p>

      <ProductForm
        v-else-if="initialValue"
        submit-label="Guardar cambios"
        :initial-value="initialValue"
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

.error {
  color: #b42318;
}
</style>
