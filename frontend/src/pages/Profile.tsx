import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

interface ProfileData {
  id: number;
  pseudo: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  photo: string | null;
  role: string;
}

export default function Profile() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api<ProfileData>('/api/profile').then((p) => {
      setProfile(p);
      setPseudo(p.pseudo);
      setEmail(p.email);
      setFirstname(p.firstname ?? '');
      setLastname(p.lastname ?? '');
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const updated = await api<ProfileData>('/api/profile', {
        method: 'PUT',
        body: { pseudo, email, firstname, lastname },
      });
      setProfile(updated);
      refresh({ id: updated.id, pseudo: updated.pseudo, email: updated.email, role: updated.role });
      setMessage('Profil mis à jour.');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    const res = await api<{ photo: string }>('/api/profile/photo', {
      method: 'POST',
      formData: fd,
    });
    setProfile((p) => (p ? { ...p, photo: res.photo } : p));
  }

  if (!profile) return <p className="text-[#8a5a2b]">Chargement...</p>;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-[#5d2c00]">Mon profil</h1>

      <div className="card flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#ead9b0] text-2xl">
          {profile.photo ? (
            <img src={profile.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span>{profile.pseudo.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <p className="font-medium text-[#5d2c00]">{profile.pseudo}</p>
          <p className="text-sm text-[#8a5a2b]">Rôle : {profile.role}</p>
          <label className="mt-2 inline-block cursor-pointer text-sm text-[#5d2c00] underline">
            Changer la photo
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </label>
        </div>
      </div>

      <form onSubmit={save} className="card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prénom</label>
            <input
              className="input"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Nom</label>
            <input
              className="input"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Pseudo</label>
          <input className="input" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary" type="submit">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
