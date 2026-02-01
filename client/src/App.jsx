import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/posts';

const initialForm = {
  titulo: '',
  img: '',
  descripcion: ''
};

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError('No se pudieron cargar los posts');
      }
    };

    loadPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.titulo || !form.img || !form.descripcion) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error('Error al crear el post');
      }

      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      setForm(initialForm);
    } catch (err) {
      setError('No se pudo guardar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/like/${id}`, { method: 'PUT' });
      if (!res.ok) {
        throw new Error('Error al registrar like');
      }

      const updated = await res.json();
      setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)));
    } catch (err) {
      setError('No se pudo registrar el like');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Error al eliminar post');
      }

      await res.json();
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError('No se pudo eliminar el post');
    }
  };

  return (
    <div className="page">
      <h1>📷 Like Me 📷</h1>
      <div className="layout">
        <form className="card form" onSubmit={handleSubmit}>
          <h2>Agregar post</h2>
          <label>
            Título
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Escribe un título"
            />
          </label>
          <label>
            URL de la imagen
            <input
              name="img"
              value={form.img}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
          <label>
            Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              placeholder="Cuenta algo sobre la foto"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Agregar'}
          </button>
        </form>

        <div className="posts">
          {posts.map((post) => (
            <article className="card post" key={post.id}>
              <div className="image" style={{ backgroundImage: `url(${post.img})` }} />
              <div className="post-body">
                <h3>{post.titulo}</h3>
                <p className="description">{post.descripcion}</p>
                <div className="actions">
                  <button
                    type="button"
                    className="like-btn"
                    onClick={() => handleLike(post.id)}
                  >
                    ❤️ {post.likes ?? 0}
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                    aria-label="Eliminar post"
                  >
                    ✖
                  </button>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 && <p className="empty">Aún no hay posts, agrega el primero.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
