import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

function navClass({ isActive }: { isActive: boolean }): string {
  return [
    'rounded-md px-3 py-1.5 text-sm font-semibold transition',
    isActive ? 'bg-white/25 text-white' : 'text-white/85 hover:bg-white/15 hover:text-white',
  ].join(' ');
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-10 border-b-4 border-[#b5651d] bg-gradient-to-r from-[#7a1fa2] via-[#1f6fb2] to-[#0e8a6e] shadow-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white drop-shadow">
          <span className="grid h-8 w-8 place-items-center rounded-md border-2 border-white/70 bg-[#ffcf3f] text-[#7a1fa2] shadow">
            ✶
          </span>
          Livre d'Or
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" className={navClass} end>
            Livre d'or
          </NavLink>
          <NavLink to="/blog" className={navClass}>
            Blog
          </NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/moderation" className={navClass}>
                Modération
              </NavLink>
              <NavLink to="/admin/blog" className={navClass}>
                Articles
              </NavLink>
              <NavLink to="/admin/users" className={navClass}>
                Comptes
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/profile" className={navClass}>
                {user.pseudo}
              </NavLink>
              <button className="btn-ghost" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
