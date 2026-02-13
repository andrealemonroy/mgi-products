# Sistema de Gestion de Productos

Modulo frontend desarrollado con Nuxt 4, Vue 3, Composition API y TypeScript para autenticacion y gestion de productos consumiendo DummyJSON.

## Comprension del problema

Este modulo resuelve la necesidad de autenticar un usuario y ejecutar un flujo completo de gestion de productos desde UI: listar, buscar, ordenar, ver detalle, crear y editar.

Usuario objetivo:
- Usuario interno de negocio u operación que administra catálogo de productos.

Flujos principales:
- Login y persistencia de sesion.
- Consulta de productos con filtros básicos.
- Consulta de detalle de producto.
- Creacion de producto.
- Edicion de producto.

## Planificacion previa

Partes identificadas:
- Capa de acceso a API (`services`).
- Tipos de dominio (`types`).
- Estado de autenticacion y persistencia (`composables/useAuth.ts`).
- Seguridad de rutas (`middleware/auth.global.ts`).
- Vistas de negocio (`pages`).
- Componentes reutilizables (`components/ProductForm.vue`).
- Utilidades y validaciones (`utils`).

Orden de implementacion:
1. Infraestructura base (http, auth, middleware).
2. Login y navegacion protegida.
3. Listado de productos (loading, error, search, sorting).
4. Detalle de producto con SEO.
5. Formulario reusable para crear/editar.
6. Pruebas unitarias de reglas de dominio.
7. README con decisiones tecnicas y tradeoffs.

Alcance fuera de esta iteracion:
- Paginacion avanzada en servidor.
- Manejo de refresh token y renovacion automatica.
- Roles/permisos por tipo de usuario.

## Arquitectura y estructura del proyecto

Estructura:
- `pages/`: rutas y orquestacion de casos de uso.
- `components/`: componentes visuales reutilizables.
- `composables/`: estado local compartido (auth).
- `services/`: capa de integracion HTTP y endpoints.
- `types/`: contratos TypeScript del dominio.
- `utils/`: logica pura reutilizable y validaciones.
- `middleware/`: proteccion de rutas.
- `tests/`: pruebas unitarias.

Decision de usar composables/services/middleware:
- `composables`: centraliza estado de sesion y reduce duplicacion.
- `services`: separa infraestructura de API de la UI.
- `middleware`: encapsula reglas de acceso enrutadas.

Alternativa considerada:
- Pinia para estado global. Se descarto por alcance acotado y porque `useState` + composable cubre el caso sin sobrecarga adicional.

## Decisiones tecnicas clave

Manejo de estado:
- `useState` en `useAuth` para estado compartido entre paginas y middleware.

Manejo de autenticacion:
- Login via `POST /auth/login`.
- Persistencia de `accessToken` en `localStorage`.
- Middleware global redirige:
  - sin token -> `/login`
  - con token en `/login` -> `/products`

Manejo de errores:
- Normalizacion de errores HTTP en `services/http.ts` con `HttpError`.
- Manejo de estado de error por vista/formulario.

UI:
- Estilos propios con CSS scoped, priorizando legibilidad y responsive.

TypeScript:
- Tipado de payloads/responses por dominio.
- Tipado de reglas de validacion y utilidades puras.

## Flujo de autenticacion

1. Usuario envia credenciales en `/login`.
2. `useAuth.login` llama `loginService`.
3. Si login es exitoso, se guarda `accessToken` en `localStorage` y en estado reactivo.
4. Middleware verifica token al navegar.
5. Si no hay token, redirige a `/login`.

Si el token expira:
- Actualmente no existe refresh automatico.
- Comportamiento esperado: endpoints protegidos fallan, se muestra error y el usuario debe volver a autenticar.

## Testing

Se priorizaron pruebas unitarias de logica de negocio pura:
- `getProductStatus` (estado derivado por stock o estado explicito).
- `sortByPrice` (orden asc/desc).
- `validateProductPayload` (validaciones de formulario).

No se incluyeron en esta iteracion:
- Pruebas E2E de navegacion.
- Pruebas de componentes con montaje.

Bugs que buscan prevenir:
- Reglas incorrectas de estado visual del producto.
- Ordenamiento inconsistente de resultados.
- Envio de formularios con datos invalidos.

## Limitaciones y mejoras

Limitaciones actuales:
- DummyJSON no persiste realmente cambios de create/update.
- Sin refresh token automatico.
- Sin sistema de notificaciones global.

Mejoras para un entorno real:
- Incorporar Pinia o store dedicado para cache y sincronizacion.
- Agregar paginacion server-side, filtros avanzados y debounce cancelable.
- Integrar testing de componentes y E2E.
- Mejorar accesibilidad (focus states, aria, keyboard UX).

## Pasos de ejecucion

1. Instalar dependencias:
```bash
npm install
```

2. Crear `.env` a partir de `.env.example`:
```bash
cp .env.example .env
```

3. Definir la URL de API:
```env
NUXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

5. Typecheck:
```bash
npm run typecheck
```

6. Ejecutar tests:
```bash
npm test
```

## Endpoints usados

- `POST /auth/login`
- `GET /products`
- `GET /products/search?q=`
- `GET /products/{id}`
- `POST /products/add`
- `PUT /products/{id}`
