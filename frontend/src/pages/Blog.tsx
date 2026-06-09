import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

interface Post {
  id: number;
  title: string;
  body: string;
  image: string | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');

  async function load(q = '') {
    const data = await api<Post[]>(`/api/blog${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setPosts(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#5d2c00]">Blog du lycée</h1>
        <p className="mt-2 text-[#8a5a2b]">Les actualités publiées par l'équipe pédagogique.</p>
      </section>

      <div className="flex items-center gap-2">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article..."
        />
        <button className="btn-ghost" onClick={() => load(query)}>
          Rechercher
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.id}`} className="card transition hover:border-[#c9a86a]">
            {p.image && (
              <img src={p.image} alt="" className="mb-3 h-40 w-full rounded-xl object-cover" />
            )}
            <h2 className="text-lg font-semibold text-[#5d2c00]">{p.title}</h2>
            <p className="mt-1 line-clamp-3 text-sm text-[#8a5a2b]">{p.body}</p>
            <time className="mt-3 block text-xs text-[#a07a45]">{p.created_at}</time>
          </Link>
        ))}
      </div>
    </div>
  );
}
