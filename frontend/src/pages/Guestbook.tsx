import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

interface Message {
  id: number;
  user_id: number | null;
  pseudo: string;
  content: string;
  created_at: string;
}

export default function Guestbook() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pseudo, setPseudo] = useState(user?.pseudo ?? '');
  const [content, setContent] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  async function load(q = '') {
    setError('');
    try {
      const data = await api<Message[]>(`/api/messages${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setMessages(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api('/api/messages', { method: 'POST', body: { pseudo, content } });
      setContent('');
      await load(query);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: number) {
    await api(`/api/messages/${id}`, { method: 'DELETE' });
    await load(query);
  }

  async function saveEdit(id: number) {
    await api(`/api/messages/${id}`, { method: 'PUT', body: { content: editText } });
    setEditing(null);
    await load(query);
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#5d2c00]">
          Livre d'or d'Asymis School
        </h1>
        <p className="mt-2 text-[#8a5a2b]">Laissez un petit mot souvenir</p>
      </section>

      <form onSubmit={submit} className="card space-y-3">
        <div>
          <label className="label">Pseudo</label>
          <input
            className="input"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Votre pseudo"
            required
          />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            className="input min-h-[90px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Votre message..."
            required
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex justify-end">
          <button className="btn-primary" type="submit">
            Publier
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher dans les messages..."
        />
        <button className="btn-ghost" onClick={() => load(query)}>
          Rechercher
        </button>
      </div>

      <ul className="space-y-3">
        {messages.map((m) => {
          const canEdit = user && (user.id === m.user_id || user.role === 'admin');
          return (
            <li key={m.id} className="card">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-[#5d2c00]">{m.pseudo}</span>
                <time className="text-xs text-[#a07a45]">{m.created_at}</time>
              </div>
              {editing === m.id ? (
                <div className="space-y-2">
                  <textarea
                    className="input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={() => saveEdit(m.id)}>
                      Enregistrer
                    </button>
                    <button className="btn-ghost" onClick={() => setEditing(null)}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="prose-invert text-[#3a2a18]"
                  dangerouslySetInnerHTML={{ __html: m.content }}
                />
              )}
              {canEdit && editing !== m.id && (
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setEditing(m.id);
                      setEditText(m.content);
                    }}
                  >
                    Modifier
                  </button>
                  <button className="btn-ghost" onClick={() => remove(m.id)}>
                    Supprimer
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
