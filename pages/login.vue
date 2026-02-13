<script setup lang="ts">
import type { LoginPayload } from '../types/auth'
import { getUserFacingErrorMessage } from '../utils/error-messages'

useSeoMeta({
  title: 'Login | MGi Products',
  description: 'Inicia sesion para gestionar productos',
})

const { login } = useAuth()

const form = reactive<LoginPayload>({
  username: '',
  password: '',
})

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit() {
  errorMessage.value = null
  isSubmitting.value = true

  try {
    await login({ ...form })
    await navigateTo('/products')
  } catch (error: unknown) {
    errorMessage.value = getUserFacingErrorMessage(error, 'login')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="card">
      <h1>Sistema de Gestion de Productos</h1>
      <p>Accede para crear y administrar productos.</p>
      <p>Credenciales de prueba: <b>emilys</b> / <b>emilyspass</b></p>

      <form @submit.prevent="onSubmit">
        <label>
          Usuario
          <input
            v-model="form.username"
            required
            autocomplete="username"
            placeholder="kminchelle"
          />
        </label>

        <label>
          Password
          <input
            v-model="form.password"
            required
            type="password"
            autocomplete="current-password"
          />
        </label>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(145deg, #eef2ff, #f8fafc);
}

.card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e4e7ec;
  box-shadow: 0 20px 40px rgb(16 24 40 / 8%);
}

h1 {
  margin: 0;
  font-size: 24px;
}

p {
  color: #475467;
}

form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

input,
button {
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
}

button {
  background: #111927;
  color: #fff;
}

.error {
  margin: 0;
  color: #b42318;
}
</style>
