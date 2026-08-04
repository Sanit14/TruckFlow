import { usePageTransition } from '../../hooks/usePageTransition';

// ponytail: decorative positions only, not wired to real fleet data —
// swap for a live aggregate once the Supabase backend (session 4) exists
const STAGE_DOTS = [
  { top: '32%', left: '28%', color: '#34d399' },
  { top: '25%', left: '68%', color: '#fbbf24' },
  { top: '65%', left: '60%', color: '#f87171' },
  { top: '58%', left: '20%', color: '#22d3ee' },
  { top: '72%', left: '78%', color: '#a78bfa' },
];

const TICKS = [
  { v: '10s', l: 'Position refresh' },
  { v: '6', l: 'Live stages tracked' },
  { v: 'Your call', l: 'Geofence radius' },
  { v: '0', l: 'Spreadsheets needed' },
];

export default function Hero() {
  const goto = usePageTransition();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-10 items-center py-8 md:py-14">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-4 h-px bg-brand-400" />
            Live fleet operations
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.04] tracking-tight text-balance mb-5">
            Every truck, every second, <span className="text-accent-400">one screen.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md mb-7">
            GPS and fuel data stream straight from your trucks. See incoming, loading, idle
            or in service the instant it changes — with a geofence radius you set yourself.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => goto('/trial')}
              className="bg-accent-600 hover:bg-accent-500 active:bg-accent-700 text-white font-semibold rounded-xl px-5 py-3 transition-all duration-200 shadow-lg shadow-accent-900/40"
            >
              Start free trial →
            </button>
            <a href="#how-it-works" className="btn-ghost px-5 py-3">See how it works</a>
          </div>
        </div>

        {/* Radar visual */}
        <div className="relative aspect-square rounded-2xl border border-white/10 glass overflow-hidden animate-slide-up">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,.16), transparent 65%)' }}
          />
          {[40, 65, 90].map((pct) => (
            <div
              key={pct}
              className="absolute top-1/2 left-1/2 rounded-full border border-brand-500/30"
              style={{ width: `${pct}%`, height: `${pct}%`, transform: 'translate(-50%,-50%)' }}
            />
          ))}
          <div
            className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-sm bg-brand-400"
            style={{ transform: 'translate(-50%,-50%)', boxShadow: '0 0 0 5px rgba(96,165,250,.25)' }}
          />
          {STAGE_DOTS.map((d, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse-slow"
              style={{ top: d.top, left: d.left, background: d.color, boxShadow: `0 0 8px 2px ${d.color}55` }}
            />
          ))}
        </div>
      </div>

      {/* Metrics ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-white/8 stagger-3">
        {TICKS.map((t, i) => (
          <div key={t.l} className={`text-center py-4 px-2 ${i > 0 ? 'border-l border-white/8' : ''}`}>
            <div className="text-white font-extrabold text-xl tabular-nums">{t.v}</div>
            <div className="text-slate-500 text-[10.5px] uppercase tracking-wide mt-1">{t.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
