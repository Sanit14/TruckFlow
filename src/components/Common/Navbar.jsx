import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const dashboardPath = '/dashboard';

  // Scroll-shrink effect
  useEffect(() => {
    const el = document.querySelector('main');
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 12);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`glass-dark border-b border-white/6 px-4 md:px-6 flex items-center justify-between shrink-0 z-20 relative
        transition-all duration-300 ease-out
        ${scrolled ? 'h-12 shadow-lg shadow-black/30' : 'h-14'}`}
    >
      {/* Logo */}
      <button
        id="nav-logo"
        onClick={() => navigate(dashboardPath)}
        className="flex items-center gap-2.5 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow shadow-brand-900/50 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-700/40 transition-all duration-200">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-tight leading-none group-hover:text-brand-300 transition-colors duration-150">TruckFlow</span>
      </button>

      {/* Nav links (desktop) */}
      <div className="flex items-center gap-1">
        <NavLink id="nav-dashboard" active={pathname === dashboardPath} onClick={() => navigate(dashboardPath)}>
          Dashboard
        </NavLink>
        <NavLink id="nav-map" active={pathname === '/dashboard/map'} onClick={() => navigate('/dashboard/map')}>
          Live Map
        </NavLink>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-white text-xs font-semibold leading-none">{user?.name ?? 'User'}</span>
        </div>
        {/* Avatar with glow ring on hover */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold uppercase select-none ring-2 ring-transparent hover:ring-brand-400/60 transition-all duration-200 shadow-md shadow-brand-900/40">
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
      className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
          ? 'text-white bg-brand-600/20'
          : 'text-slate-400 hover:text-white hover:bg-white/8'
        }`}
    >
      {children}
      {/* Animated active underline */}
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-brand-400
          transition-all duration-300 ease-out
          ${active ? 'w-4/5 opacity-100' : 'w-0 opacity-0'}`}
      />
    </button>
  );
}
