import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/posts', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM posts ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts', error);
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body || {};

  if (!titulo || !img || !descripcion) {
    return res.status(400).json({ error: 'titulo, img y descripcion son requeridos' });
  }

  try {
    const insertQuery =
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
    const { rows } = await query(insertQuery, [titulo, img, descripcion, 0]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating post', error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

app.put('/posts/like/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'ID invalido' });
  }

  try {
    const updateQuery = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *';
    const { rows } = await query(updateQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating likes', error);
    res.status(500).json({ error: 'Error updating likes' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'ID invalido' });
  }

  try {
    const deleteQuery = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const { rows } = await query(deleteQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json({ message: 'Post eliminado', post: rows[0] });
  } catch (error) {
    console.error('Error deleting post', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

app.listen(port, () => {
  console.log(`API Like Me escuchando en http://localhost:${port}`);
});
