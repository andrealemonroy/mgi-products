<script setup lang="ts">
import { getProductByIdService } from '../../../services/products.service'
import { getProductStatus } from '../../../utils/products'
import { getLocalProductById } from '../../../utils/localProducts'
import { getUserFacingErrorMessage } from '../../../utils/error-messages'

const route = useRoute()
const productId = computed(() => Number(route.params.id))

if (Number.isNaN(productId.value)) {
  throw createError({ statusCode: 400, statusMessage: 'ID de producto invalido' })
}

const { data, pending, error } = await useAsyncData(`product-${productId.value}`, () => {
  return getProductByIdService(productId.value)
})

const localProduct = computed(() => getLocalProductById(productId.value))
const product = computed(() => localProduct.value ?? data.value)

const errorMessage = computed(() => {
  if (product.value) {
    return null
  }

  if (!error.value) {
    return null
  }

  return getUserFacingErrorMessage(error.value, 'productDetail')
})

useSeoMeta({
  title: () => (product.value ? `${product.value.title} | MGi Products` : 'Detalle de producto | MGi Products'),
  description: () => (product.value ? product.value.description : 'Detalle de producto'),
})
</script>

<template>
  <main class="product-detail">
    <NuxtLink to="/products" class="back">Volver al listado</NuxtLink>

    <p v-if="pending && !product">Cargando detalle...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <article v-else-if="product" class="card">
      <img :src="product.thumbnail" :alt="product.title" />

      <div class="content">
        <h1>{{ product.title }}</h1>
        <p>{{ product.description }}</p>

        <ul>
          <li><strong>Categoria:</strong> {{ product.category }}</li>
          <li><strong>Precio:</strong> ${{ product.price }}</li>
          <li><strong>Stock:</strong> {{ product.stock }}</li>
          <li><strong>Estado:</strong> {{ getProductStatus(product) }}</li>
          <li><strong>Marca:</strong> {{ product.brand || 'N/A' }}</li>
          <li><strong>Rating:</strong> {{ product.rating || 'N/A' }}</li>
        </ul>

        <NuxtLink :to="`/products/${product.id}/edit`" class="edit">Editar producto</NuxtLink>
      </div>
    </article>
  </main>
</template>

<style scoped>
.product-detail {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 16px;
  display: grid;
  gap: 16px;
}

.back,
.edit {
  width: fit-content;
  text-decoration: none;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px 12px;
  color: #111927;
}

.card {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(180px, 280px) 1fr;
  border: 1px solid #e4e7ec;
  border-radius: 16px;
  padding: 16px;
}

img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.content {
  display: grid;
  gap: 12px;
}

h1 {
  margin: 0;
}

p {
  margin: 0;
}

ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 18px;
}

.error {
  color: #b42318;
}

@media (max-width: 768px) {
  .card {
    grid-template-columns: 1fr;
  }
}
</style>
