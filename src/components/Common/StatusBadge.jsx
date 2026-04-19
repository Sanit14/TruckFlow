import { statusKey } from '../../data/mockData';

const DOTS = {
  idle: 'bg-slate-400',
  loading: 'bg-blue-400',
  unloading: 'bg-amber-400',
  incoming: 'bg-emerald-400',
  outgoing: 'bg-rose-400',
};

const LABELS = {
  idle: 'text-slate-300 border-slate-600/40 bg-slate-700/60',
  loading: 'text-blue-300 border-blue-700/40 bg-blue-900/60',
  unloading: 'text-amber-300 border-amber-700/40 bg-amber-900/60',
  incoming: 'text-emerald-300 border-emerald-700/40 bg-emerald-900/60',
  outgoing: 'text-rose-300 border-rose-700/40 bg-rose-900/60',
};

export default function StatusBadge({ status, size = 'md' }) {
  const key = statusKey(status);
  const dot = DOTS[key] ?? DOTS.idle;
  const label = LABELS[key] ?? LABELS.idle;
  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${label} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse-slow`} />
      {status}
    </span>
  );
}
