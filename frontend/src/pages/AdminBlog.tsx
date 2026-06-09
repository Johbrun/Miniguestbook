import { useEffect, useState } from 'react';
import { api } from '../api';

interface Post {
  id: number;
  title: string;
  body: string;
  image: string | null;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setPosts(await api<Post[]>('/api/blog'));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('body', body);
      if (image) fd.append('image', image);
      await api('/api/blog', { method: 'POST', formData: fd });
      setTitle('');
      setBody('');
      setImage(null);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function remove(id: number) {
    await api(`/api/blog/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#5d2c00]">Gestion des articles</h1>

      <form onSubmit={create} className="card space-y-3">
        <div>
          <label className="label">Titre</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Contenu</label>
          <textarea
            className="input min-h-[120px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Image (optionnelle)</label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-[#8a5a2b]"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary" type="submit">
          Publier l'article
        </button>
      </form>

      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium text-[#5d2c00]">{p.title}</p>
              <p className="line-clamp-1 text-sm text-[#8a5a2b]">{p.body}</p>
            </div>
            <button className="btn-ghost" onClick={() => remove(p.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
