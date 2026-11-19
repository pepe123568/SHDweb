# Proyecto SHD - Muro de publicaciones Angular

Proyecto de Angular con **solo Bootstrap 5**, sin CSS personalizado.

## Requisitos

Node.js compatible con Angular 22 (recomendado Node 22 actualizado), npm, acceso a internet.

## Ejecutar

Desde la carpeta `tienda`:

```bash
npm install
npm start
```

Visita http://localhost:4200/login

**Usuario de FakeStore:** `johnd`  
**Contraseña:** `m38rmF$`

## Rutas

- `/login`: pública, autenticación por POST a `https://fakestoreapi.com/auth/login`; guarda el `token` recibido en `localStorage` bajo `fakestore_token`.
- `/posts`: muro protegido con `CanActivateFn`. Sin token, redirige a `/login`.
- Rutas desconocidas: redirigen a `/login`.

## CRUD

`PostsService` utiliza `HttpClient` y `https://jsonplaceholder.typicode.com/posts`:

- GET /posts — carga las publicaciones.
- POST /posts — crea una publicación simulada.
- PUT /posts/:id — edita una publicación existente simulada.
- DELETE /posts/:id — elimina una publicación existente simulada.

**Nota:** JSONPlaceholder no guarda los cambios permanentemente. Los elementos creados localmente se editan/eliminan solo en pantalla porque no existen en el servidor. Al recargar vuelven los datos de la API.

## Desplegar en Vercel

1. Sube la carpeta `tienda` (su contenido, incluyendo `vercel.json`) a un repositorio de GitHub.
2. En https://vercel.com, inicia sesión y elige Add New > Project.
3. Importa el repositorio y confirma que **Root Directory** sea la carpeta que contiene `package.json` y `vercel.json`.
4. Configura **Framework Preset: Angular**, **Build Command: npm run build**, y **Output Directory: dist/tienda/browser** (ya establecido en `vercel.json`). Selecciona una versión de Node compatible con Angular 22.
5. Pulsa Deploy y copia la URL pública resultante para entregarla.
6. Verifica que abrir `/posts` sin iniciar sesión redirija a `/login` y que refrescar la ruta `/posts` no muestre 404.

`vercel.json` incluye una rewrite para las rutas del frontend.

## Aclaración de seguridad

El guard del navegador y el token en localStorage satisfacen la demostración solicitada, pero **no protegen una API pública**. Una aplicación real necesita verificar la autenticación y autorización en su propio backend.
