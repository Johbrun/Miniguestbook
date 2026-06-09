import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

interface Post {
  id: number;
  title: string;
  body: string;
  image: string | null;
  created_at: string;
}

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    api<Post>(`/api/blog/${id}`)
      .then(setPost)
      .catch(() => setPost(null));
  }, [id]);

  if (!post) return <p className="text-[#8a5a2b]">Article introuvable.</p>;

  return (
    <article className="space-y-4">
      <Link to="/blog" className="text-sm text-[#8a5a2b] hover:text-[#5d2c00]">
        ← Retour au blog
      </Link>
      <h1 className="text-3xl font-semibold text-[#5d2c00]">{post.title}</h1>
      <time className="block text-xs text-[#a07a45]">{post.created_at}</time>
      {post.image && <img src={post.image} alt="" className="rounded-2xl" />}
      <div className="whitespace-pre-line leading-relaxed text-[#3a2a18]">{post.body}</div>
    </article>
  );
}
