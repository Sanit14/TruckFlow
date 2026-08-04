import MeshBackground from '../Common/MeshBackground';
import { usePageTransition } from '../../hooks/usePageTransition';

const STATS = [
  { l: 'Trucks', v: '8' },
  { l: 'On the move', v: '5' },
  { l: 'Avg fuel eff.', v: '3.9' },
  { l: 'Docs expiring', v: '2', warn: true },
];

export default function TrialDemoPage() {
  const goto = usePageTransition();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0d14]">
      <MeshBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center animate-fade-in">
        <button onClick={() => goto('/')} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white text-xs font-semibold mb-6 transition-colors">
          ← Back to plans
        </button>

        <div className="flex items-center justify-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-4 h-px bg-brand-400" />Interactive preview
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight text-balance">
          This is what you'll see on day one.
        </h1>
        <p className="text-slate-400 text-sm mt-2.5 max-w-md mx-auto">
          Sample fleet, live-styled. Your real dashboard fills in the moment your first tracker reports in.
        </p>

        <div className="glass rounded-2xl mt-8 text-left relative overflow-hidden animate-slide-up">
          <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-wide bg-black/50 text-brand-300 px-2.5 py-1 rounded-full z-10">
            Sample data
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-[18px]">
            {STATS.map((s) => (
              <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">{s.l}</div>
                <div className={`text-xl font-extrabold tabular-nums mt-1 ${s.warn ? 'text-amber-400' : 'text-white'}`}>{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mx-[18px] mb-[18px] flex gap-2.5 items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-200">
            <span>🔄</span> TRK-001 crossed into the geofence — now Incoming
          </div>
        </div>

        <button
          onClick={() => goto('/signup')}
          className="bg-accent-600 hover:bg-accent-500 active:bg-accent-700 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 shadow-lg shadow-accent-900/40 mt-8"
        >
          Continue — create your account →
        </button>
      </div>
    </div>
  );
}
