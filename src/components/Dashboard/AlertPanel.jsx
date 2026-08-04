import { useTrucks } from '../../context/TruckContext';
import { fmtTime } from '../../data/mockData';

const TYPE_STYLE = {
  status: {
    icon: '🔄',
    bg: 'bg-brand-900/30 border-brand-700/30 hover:border-brand-500/40',
    dot: 'bg-brand-400',
  },
  geofence: {
    icon: '📍',
    bg: 'bg-amber-900/30 border-amber-700/30 hover:border-amber-500/40',
    dot: 'bg-amber-400',
  },
  service: {
    icon: '🔧',
    bg: 'bg-violet-900/30 border-violet-700/30 hover:border-violet-500/40',
    dot: 'bg-violet-400',
  },
  expiry: {
    icon: '🛡️',
    bg: 'bg-rose-900/30 border-rose-700/30 hover:border-rose-500/40',
    dot: 'bg-rose-400',
  },
};

export default function AlertPanel() {
  const { alerts } = useTrucks();

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Live Alerts</h3>
        <span className="text-xs text-slate-500 glass rounded-full px-2.5 py-0.5">
          {alerts.length} event{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: 340 }}>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-600">
            <span className="text-3xl mb-2">🔔</span>
            <p className="text-sm">No alerts yet</p>
          </div>
        ) : (
          alerts.map((a, i) => {
            const style = TYPE_STYLE[a.type] ?? TYPE_STYLE.status;
            return (
              <div
                key={a.id}
                className={`flex gap-3 rounded-xl px-3 py-2.5 border text-xs card-hover animate-slide-up ${style.bg}`}
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <span className="text-base shrink-0 leading-none mt-0.5">{style.icon}</span>
                <div className="min-w-0">
                  <p className="text-slate-200 font-medium leading-tight truncate">{a.message}</p>
                  <p className="text-slate-500 mt-0.5">{fmtTime(a.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
