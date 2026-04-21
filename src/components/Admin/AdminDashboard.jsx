import { useState } from 'react';
import { useTrucks } from '../../context/TruckContext';
import TruckMap from './TruckMap';
import AlertPanel from './AlertPanel';
import TruckManagement from './TruckManagement';
import AnalyticsDashboard from './AnalyticsDashboard';

const STAT_CARDS = (trucks, alerts) => [
  {
    id: 'stat-total',
    label: 'Total Trucks',
    value: trucks.length,
    icon: '🚛',
    color: 'from-brand-700/40 to-brand-900/40 border-brand-600/20',
  },
  {
    id: 'stat-active',
    label: 'Active',
    value: trucks.filter((t) => t.status !== 'Idle').length,
    icon: '✅',
    color: 'from-emerald-700/30 to-emerald-900/30 border-emerald-600/20',
  },
  {
    id: 'stat-idle',
    label: 'Idle',
    value: trucks.filter((t) => t.status === 'Idle').length,
    icon: '⏸️',
    color: 'from-slate-700/30 to-slate-900/30 border-slate-600/20',
  },
  {
    id: 'stat-alerts',
    label: 'Alerts Today',
    value: alerts.length,
    icon: '🔔',
    color: 'from-amber-700/30 to-amber-900/30 border-amber-600/20',
  },
];

export default function AdminDashboard() {
  const { trucks, alerts } = useTrucks();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'map' | 'trucks'

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS(trucks, alerts).map((s) => (
          <div key={s.id} id={s.id}
            className={`glass rounded-2xl p-4 bg-gradient-to-br border ${s.color}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/8 pb-0">
        {['overview', 'fleet', 'analytics', 'alerts'].map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all capitalize ${
              activeTab === tab
                ? 'text-white border-b-2 border-brand-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'fleet' ? '🚛 Fleet' : tab === 'analytics' ? '📊 Analytics' : tab}
          </button>
        ))}
      </div>

      {/* ── Overview tab: map + alerts side by side ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map (2/3 width) */}
          <div className="lg:col-span-2 glass rounded-2xl p-3 h-[420px]">
            <TruckMap />
          </div>
          {/* Alerts (1/3 width) */}
          <div className="lg:col-span-1">
            <AlertPanel />
          </div>
        </div>
      )}

      {/* ── Fleet tab: add/remove trucks, insurance alerts ── */}
      {activeTab === 'fleet' && (
        <TruckManagement />
      )}

      {/* ── Analytics tab ── */}
      {activeTab === 'analytics' && (
        <AnalyticsDashboard />
      )}

      {/* ── Alerts tab ── */}
      {activeTab === 'alerts' && (
        <div className="max-w-2xl">
          <AlertPanel />
        </div>
      )}
    </div>
  );
}
