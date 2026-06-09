import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    pseudo: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
  });
  const [error, setError] = useState('');

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api('/api/auth/register', { method: 'POST', body: form });
      await login(form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold text-[#5d2c00]">Créer un compte</h1>
      <form onSubmit={submit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prénom</label>
            <input className="input" value={form.firstname} onChange={update('firstname')} />
          </div>
          <div>
            <label className="label">Nom</label>
            <input className="input" value={form.lastname} onChange={update('lastname')} />
          </div>
        </div>
        <div>
          <label className="label">Pseudo</label>
          <input className="input" value={form.pseudo} onChange={update('pseudo')} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={update('email')}
            required
          />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={update('password')}
            required
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Créer mon compte
        </button>
        <p className="text-center text-sm text-[#8a5a2b]">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-[#5d2c00] underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
