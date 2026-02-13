<script setup lang="ts">
import { getProductsService, searchProductsService } from '../../services/products.service'
import type { Product } from '../../types/products'
import { sortByPrice, getProductStatus } from '../../utils/products'
import { mergeProductsWithLocal } from '../../utils/localProducts'
import { getUserFacingErrorMessage } from '../../utils/error-messages'

useSeoMeta({
  title: 'Productos | MGi Products',
  description: 'Listado y gestion de productos',
})

const { logout } = useAuth()

const query = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

let searchTimer: ReturnType<typeof setTimeout> | null = null

async function loadProducts(currentQuery = '') {
  loading.value = true
  error.value = null

  try {
    const normalizedQuery = currentQuery.trim()
    const response = normalizedQuery
      ? await searchProductsService(normalizedQuery)
      : await getProductsService()

    products.value = mergeProductsWithLocal(response.products, normalizedQuery)
  } catch (err: unknown) {
    error.value = getUserFacingErrorMessage(err, 'productsList')
  } finally {
    loading.value = false
  }
}

watch(query, (newValue) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    loadProducts(newValue)
  }, 300)
})

const sortedProducts = computed(() => sortByPrice(products.value, sortDirection.value))

onMounted(() => {
  loadProducts()
})

function onLogout() {
  logout()
  navigateTo('/login')
}
</script>

<template>
  <main class="products-page">
    <header>
      <div>
        <h1>Productos</h1>
        <p>Administra catalogo, stock y precios.</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/products/new" class="primary">Nuevo producto</NuxtLink>
        <button class="secondary" @click="onLogout">Salir</button>
      </div>
    </header>

    <section class="toolbar">
      <input v-model="query" type="search" placeholder="Buscar por nombre" />

      <select v-model="sortDirection">
        <option value="asc">Precio ascendente</option>
        <option value="desc">Precio descendente</option>
      </select>
    </section>

    <p v-if="loading">Cargando productos...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in sortedProducts" :key="product.id">
            <td>
              <img :src="product.thumbnail" :alt="product.title" loading="lazy" />
            </td>
            <td>{{ product.title }}</td>
            <td>{{ product.category }}</td>
            <td>${{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span :class="getProductStatus(product).toLowerCase()">{{ getProductStatus(product) }}</span>
            </td>
            <td class="row-actions">
              <NuxtLink :to="`/products/${product.id}`">Ver</NuxtLink>
              <NuxtLink :to="`/products/${product.id}/edit`">Editar</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.products-page {
  padding: 24px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
  width: 100%;
}

h1 {
  margin: 0;
}

p {
  margin: 4px 0 0;
  color: #475467;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.primary,
.secondary,
.toolbar input,
.toolbar select {
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  font: inherit;
}

.primary {
  background: #111927;
  color: #fff;
  text-decoration: none;
}

.toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
  margin: 20px 0
}

.toolbar input {
  min-width: 240px;
  flex: 1;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e4e7ec;
  border-radius: 12px;
  width: 100%
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e4e7ec;
}

img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.active {
  color: #027a48;
  font-weight: 600;
}

.inactive {
  color: #b42318;
  font-weight: 600;
}

.error {
  color: #b42318;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
