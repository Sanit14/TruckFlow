import { useState } from 'react';
import { useTrucks } from '../../context/TruckContext';
import TruckMap from './TruckMap';
import AlertPanel from './AlertPanel';
import TruckManagement from './TruckManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import DocumentsList from './DocumentsList';
import { DashboardSkeleton } from '../Common/Skeleton';
import { useCountUp } from '../../hooks/useCountUp';

// ── Animated stat card ───────────────────────────────────────────
function StatCard({ id, label, value, icon, color, delay }) {
  const animated = useCountUp(value);
  return (
    <div
      id={id}
      style={{ animationDelay: `${delay}ms` }}
      className={`glass card-hover card-glow rounded-2xl p-4 bg-gradient-to-br border ${color} stagger-${Math.min(delay / 60 + 1, 7)}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-white mt-1 tabular-nums">{animated}</p>
        </div>
        <span className="text-2xl drop-shadow-sm">{icon}</span>
      </div>
    </div>
  );
}

const STAT_CARDS = (trucks, alerts) => [
  {
    id: 'stat-total',
    label: 'Total Trucks',
    value: trucks.length,
    icon: '🚛',
    color: 'from-brand-700/40 to-brand-900/40 border-brand-600/20',
    delay: 0,
  },
  {
    id: 'stat-active',
    label: 'Active',
    value: trucks.filter((t) => t.status !== 'Idle').length,
    icon: '✅',
    color: 'from-emerald-700/30 to-emerald-900/30 border-emerald-600/20',
    delay: 60,
  },
  {
    id: 'stat-idle',
    label: 'Idle',
    value: trucks.filter((t) => t.status === 'Idle').length,
    icon: '⏸️',
    color: 'from-slate-700/30 to-slate-900/30 border-slate-600/20',
    delay: 120,
  },
  {
    id: 'stat-alerts',
    label: 'Alerts Today',
    value: alerts.length,
    icon: '🔔',
    color: 'from-amber-700/30 to-amber-900/30 border-amber-600/20',
    delay: 180,
  },
];

const TABS = [
  { key: 'overview',   label: 'Overview' },
  { key: 'map',        label: '🗺️ Live Map' },
  { key: 'fleet',      label: '🚛 Fleet' },
  { key: 'documents',  label: '📄 Documents' },
  { key: 'analytics',  label: '📊 Analytics' },
  { key: 'alerts',     label: 'Alerts' },
];

export default function Dashboard() {
  const { trucks, alerts, loading } = useTrucks();
  const [activeTab, setActiveTab] = useState('overview');
  const [prevTab, setPrevTab] = useState(null);

  const handleTab = (tab) => {
    if (tab === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 stagger-1">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Real-time fleet overview · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-300">Live Tracking</span>
        </div>
      </div>

      {/* Stat cards — staggered entrance + count-up */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-2">
        {STAT_CARDS(trucks, alerts).map((s) => (
          <StatCard key={s.id} {...s} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/8 overflow-x-auto scrollbar-hide stagger-3">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            id={`tab-${key}`}
            onClick={() => handleTab(key)}
            className={`relative px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 capitalize whitespace-nowrap ${
              activeTab === key
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-400 transition-all duration-300 ${
                activeTab === key ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ── Tab content — slides in from right on each switch ── */}
      <div key={activeTab} className="animate-slide-in-right">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass rounded-2xl p-3 h-[420px]">
              <TruckMap />
            </div>
            <div className="lg:col-span-1">
              <AlertPanel />
            </div>
          </div>
        )}

        {/* Map */}
        {activeTab === 'map' && (
          <div className="glass rounded-2xl p-3 h-[600px]">
            <TruckMap showRadiusControl />
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && <DocumentsList />}

        {/* Fleet */}
        {activeTab === 'fleet' && <TruckManagement />}

        {/* Analytics */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* Alerts */}
        {activeTab === 'alerts' && (
          <div className="max-w-2xl">
            <AlertPanel />
          </div>
        )}
      </div>
    </div>
  );
}
