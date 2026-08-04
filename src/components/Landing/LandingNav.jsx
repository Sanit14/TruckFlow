import { usePageTransition } from '../../hooks/usePageTransition';

export default function LandingNav() {
  const goto = usePageTransition();

  return (
    <nav className="flex items-center justify-between px-4 md:px-6 py-5 max-w-6xl mx-auto relative z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow shadow-brand-900/50">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-tight">TruckFlow</span>
      </div>

      <div className="hidden sm:flex items-center gap-7 text-sm font-medium text-slate-400">
        <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
        <a href="#how-it-works-hardware" className="hover:text-white transition-colors">Hardware</a>
        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      </div>

      <button onClick={() => goto('/login')} className="btn-ghost text-sm py-2 px-4">Sign in</button>
    </nav>
  );
}
