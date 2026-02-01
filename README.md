# Like Me - Parte I

Aplicación full stack para crear posts y verlos con contador de likes (inicialmente 0).

## Requisitos previos
- Node.js 18+
- PostgreSQL

## Base de datos
Ejecuta en PostgreSQL:

```sql
CREATE DATABASE likeme;
\c likeme
CREATE TABLE posts (id SERIAL, titulo VARCHAR(25), img VARCHAR(1000), descripcion VARCHAR(255), likes INT);
```

## Backend (Express)
1. Copia `.env.example` a `.env` y ajusta credenciales de PostgreSQL.
2. Instala dependencias:
   - `cd server`
   - `npm install`
3. Ejecuta el servidor:
   - Dev: `npm run dev`
   - Prod: `npm start`

El servidor expone:
- `GET /posts` → lista de posts.
- `POST /posts` → crea un post `{ titulo, img, descripcion }`, `likes` inicia en 0.

## Frontend (React + Vite)
1. `cd client`
2. `npm install`
3. `npm run dev` y abre el enlace indicado (por defecto http://localhost:5173).

La app consume el backend en `http://localhost:3000/posts`. Ajusta `API_URL` en `src/App.jsx` si usas otro puerto.

## Estructura
- `server/`: API Express con `cors` y `pg`.
- `client/`: React (Vite) con formulario y listado de posts.

## Notas
- Habilita CORS en el backend (ya configurado).
- Si cambias el puerto del backend, actualiza también la constante `API_URL` del cliente.
