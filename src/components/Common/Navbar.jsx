import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin   = user?.role === 'admin';
  const adminPath = '/admin';
  const mgPath    = '/manager';

  return (
    <nav className="glass-dark border-b border-white/6 px-4 md:px-6 h-14 flex items-center justify-between shrink-0">
      {/* Logo */}
      <button
        id="nav-logo"
        onClick={() => navigate(isAdmin ? adminPath : mgPath)}
        className="flex items-center gap-2.5 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center shadow shadow-brand-900/50 group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-tight leading-none">TruckFlow</span>
      </button>

      {/* Nav links (desktop) */}
      <div className="hidden md:flex items-center gap-1">
        {isAdmin && (
          <>
            <NavLink id="nav-dashboard" active={pathname === adminPath} onClick={() => navigate(adminPath)}>
              Dashboard
            </NavLink>
            <NavLink id="nav-map" active={pathname === '/admin/map'} onClick={() => navigate('/admin/map')}>
              Live Map
            </NavLink>
          </>
        )}
        {!isAdmin && (
          <NavLink id="nav-manager" active={pathname === mgPath} onClick={() => navigate(mgPath)}>
            My Trucks
          </NavLink>
        )}
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-white text-xs font-semibold leading-none">{user?.name ?? 'User'}</span>
          <span className="text-slate-400 text-[10px] mt-0.5 capitalize">{user?.role}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase select-none">
          {(user?.name ?? 'U')[0]}
        </div>
        <button
          id="nav-logout"
          onClick={logout}
          className="btn-ghost text-xs py-1.5 px-3"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function NavLink({ id, active, onClick, children }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? 'text-white bg-brand-600/30 border border-brand-500/30'
          : 'text-slate-400 hover:text-white hover:bg-white/8'
      }`}
    >
      {children}
    </button>
  );
}
