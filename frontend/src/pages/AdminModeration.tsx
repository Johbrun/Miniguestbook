import { useEffect, useState } from 'react';
import { api } from '../api';

interface AdminMessage {
  id: number;
  pseudo: string;
  content: string;
  hidden: number;
  created_at: string;
}

export default function AdminModeration() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);

  async function load() {
    setMessages(await api<AdminMessage[]>('/api/admin/messages'));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(m: AdminMessage) {
    await api(`/api/admin/messages/${m.id}`, { method: 'PATCH', body: { hidden: !m.hidden } });
    await load();
  }

  async function remove(id: number) {
    await api(`/api/admin/messages/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#5d2c00]">Modération des messages</h1>
      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} className="card">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-[#5d2c00]">{m.pseudo}</span>
              <span className="text-xs text-[#a07a45]">{m.created_at}</span>
            </div>
            <p className="text-sm text-[#8a5a2b]">{m.content}</p>
            <div className="mt-3 flex items-center gap-2">
              <button className="btn-ghost" onClick={() => toggle(m)}>
                {m.hidden ? 'Rendre visible' : 'Masquer'}
              </button>
              <button className="btn-ghost" onClick={() => remove(m.id)}>
                Supprimer
              </button>
              {m.hidden ? (
                <span className="text-xs text-amber-700">masqué</span>
              ) : (
                <span className="text-xs text-emerald-700">visible</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
