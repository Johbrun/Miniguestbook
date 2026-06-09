import { useEffect, useState } from 'react';
import { api } from '../api';

interface AdminUser {
  id: number;
  pseudo: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    api<AdminUser[]>('/api/admin/users').then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#5d2c00]">Comptes utilisateurs</h1>
      <p className="text-sm text-[#8a5a2b]">
        Les noms et prénoms ne sont visibles que par les administrateurs.
      </p>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#8a5a2b]">
            <tr className="border-b border-[#d8b97a]">
              <th className="py-2 pr-4">Pseudo</th>
              <th className="py-2 pr-4">Prénom</th>
              <th className="py-2 pr-4">Nom</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Rôle</th>
            </tr>
          </thead>
          <tbody className="text-[#3a2a18]">
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#d8b97a]">
                <td className="py-2 pr-4 font-medium text-[#5d2c00]">{u.pseudo}</td>
                <td className="py-2 pr-4">{u.firstname}</td>
                <td className="py-2 pr-4">{u.lastname}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      u.role === 'admin'
                        ? 'rounded-md bg-[#b5651d]/20 px-2 py-0.5 text-[#5d2c00]'
                        : 'text-[#8a5a2b]'
                    }
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
