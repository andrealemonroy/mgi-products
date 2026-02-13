<script setup lang="ts">
import type { ProductPayload } from '../types/products'
import { validateProductPayload } from '../utils/product-form'

const props = withDefaults(
  defineProps<{
    initialValue?: ProductPayload
    submitLabel: string
    loading?: boolean
    errorMessage?: string | null
  }>(),
  {
    initialValue: () => ({
      title: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      status: 'ACTIVE',
    }),
    loading: false,
    errorMessage: null,
  },
)

const emit = defineEmits<{
  submit: [payload: ProductPayload]
  cancel: []
}>()

const form = reactive<ProductPayload>({ ...props.initialValue })
const errors = reactive<Partial<Record<keyof ProductPayload, string>>>({})

watch(
  () => props.initialValue,
  (newValue) => {
    Object.assign(form, newValue)
  },
  { deep: true },
)

function onSubmit() {
  const validation = validateProductPayload(form)
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof ProductPayload]
  })
  Object.assign(errors, validation)

  if (Object.keys(validation).length > 0) {
    return
  }

  emit('submit', {
    title: form.title.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    stock: Number(form.stock),
    description: form.description.trim(),
    status: form.status,
  })
}
</script>

<template>
  <form class="product-form" @submit.prevent="onSubmit">
    <label>
      Nombre
      <input v-model="form.title" type="text" />
      <small v-if="errors.title">{{ errors.title }}</small>
    </label>

    <label>
      Categoria
      <input v-model="form.category" type="text" />
      <small v-if="errors.category">{{ errors.category }}</small>
    </label>

    <label>
      Precio
      <input v-model.number="form.price" type="number" min="0" step="0.01" />
      <small v-if="errors.price">{{ errors.price }}</small>
    </label>

    <label>
      Stock
      <input v-model.number="form.stock" type="number" min="0" step="1" />
      <small v-if="errors.stock">{{ errors.stock }}</small>
    </label>

    <label>
      Estado
      <select v-model="form.status">
        <option value="ACTIVE">Activo</option>
        <option value="INACTIVE">Inactivo</option>
      </select>
      <small v-if="errors.status">{{ errors.status }}</small>
    </label>

    <label>
      Descripcion
      <textarea v-model="form.description" rows="4" />
      <small v-if="errors.description">{{ errors.description }}</small>
    </label>

    <p v-if="errorMessage" class="server-error">{{ errorMessage }}</p>

    <div class="actions">
      <button type="button" class="secondary" :disabled="loading" @click="emit('cancel')">Cancelar</button>
      <button type="submit" :disabled="loading">{{ loading ? 'Guardando...' : submitLabel }}</button>
    </div>
  </form>
</template>

<style scoped>
.product-form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
select,
textarea,
button {
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
}

small,
.server-error {
  color: #b42318;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

button {
  background: #111927;
  color: #fff;
  cursor: pointer;
}

button.secondary {
  background: #fff;
  color: #111927;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
