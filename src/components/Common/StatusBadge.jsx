import { statusKey } from '../../data/mockData';

const DOTS = {
  idle:      'bg-slate-400',
  loading:   'bg-cyan-400  shadow-[0_0_6px_2px_rgba(34,211,238,0.5)]',
  unloading: 'bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.5)]',
  incoming:  'bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]',
  outgoing:  'bg-rose-400  shadow-[0_0_6px_2px_rgba(248,113,113,0.5)]',
  service:   'bg-violet-400 shadow-[0_0_6px_2px_rgba(167,139,250,0.5)]',
};

const LABELS = {
  idle:      'text-slate-300 border-slate-600/40 bg-slate-700/60',
  loading:   'text-cyan-300 border-cyan-700/40 bg-cyan-900/60',
  unloading: 'text-amber-300 border-amber-700/40 bg-amber-900/60',
  incoming:  'text-emerald-300 border-emerald-700/40 bg-emerald-900/60',
  outgoing:  'text-rose-300 border-rose-700/40 bg-rose-900/60',
  service:   'text-violet-300 border-violet-700/40 bg-violet-900/60',
};

export default function StatusBadge({ status, size = 'md' }) {
  const key = statusKey(status);
  const dot = DOTS[key] ?? DOTS.idle;
  const label = LABELS[key] ?? LABELS.idle;
  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200 ${label} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse-slow ${dot}`} />
      {status}
    </span>
  );
}
