# Like Me - Parte II

Aplicación full stack con React + Vite y API Express + PostgreSQL que permite crear posts, sumar likes y eliminarlos.

## Requisitos previos
- Node.js 18+
- PostgreSQL

## Base de datos
Ejecuta en PostgreSQL:

```sql
CREATE DATABASE likeme;
\c likeme
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL,
  titulo VARCHAR(25),
  img VARCHAR(1000),
  descripcion VARCHAR(255),
  likes INT
);
```

## Backend (Express)
1. Crea `.env` en `server/` con las variables: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PORT=3000`.
2. Instala dependencias:
   - `cd server`
   - `npm install`
3. Ejecuta el servidor:
   - Dev: `npm run dev`
   - Prod: `npm start`

Rutas disponibles:
- `GET /posts` → lista de posts.
- `POST /posts` → crea post `{ titulo, img, descripcion }`, `likes` inicia en 0.
- `PUT /posts/like/:id` → incrementa `likes` en 1 para el post indicado.
- `DELETE /posts/:id` → elimina el post.

Todas las consultas están en `try/catch` para retornar errores 400/404/500 según el caso.

## Frontend (React + Vite)
1. `cd client`
2. `npm install`
3. `npm run dev` (por defecto http://localhost:5174).

La app consume el backend en `http://localhost:3000/posts`. Ajusta `API_URL` en `src/App.jsx` si cambias el puerto.

## Estructura
- `server/`: API Express con `cors`, `pg` y `dotenv`.
- `client/`: React (Vite) con formulario, listado, like y eliminación de posts.

## Sugerencia para deploy rápido local
- Levanta el backend: `npm run dev --prefix server`.
- Levanta el frontend: `npm run dev --prefix client`.
- Abre el enlace indicado por Vite y prueba crear, likear y eliminar posts.
