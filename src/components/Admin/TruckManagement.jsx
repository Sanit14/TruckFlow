import { useState } from 'react';
import { useTrucks } from '../../context/TruckContext';
import { TRUCK_STATUSES, fmtTime } from '../../data/mockData';
import StatusBadge from '../Common/StatusBadge';

// ── Insurance status helper ────────────────────────────────────────
function insuranceInfo(expiryDate) {
  if (!expiryDate) return { color: 'slate', label: 'Not set', days: null, icon: '⬜' };
  const days = Math.ceil((new Date(expiryDate) - new Date()) / 86400000);
  if (days < 0)  return { color: 'rose',   label: `Expired ${Math.abs(days)}d ago`, days, icon: '🔴' };
  if (days <= 30) return { color: 'amber',  label: `${days}d left`,                  days, icon: '🟡' };
  return             { color: 'emerald', label: `${days}d left`,                  days, icon: '🟢' };
}

// ── Shared form field wrapper ──────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs text-slate-400 font-medium uppercase tracking-wide block mb-1">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Add Truck Modal ────────────────────────────────────────────────
function AddTruckModal({ onClose, onSave, truckCount }) {
  const [form, setForm] = useState({
    name: '',
    plateNumber: '',
    model: '',
    year: '',
    ownerName: '',
    driver: '',
    driverPhone: '',
    insuranceExpiry: '',
  });
  const [error, setError] = useState('');

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.plateNumber.trim()) { setError('Plate number is required.'); return; }
    onSave(form);
  };

  const defaultName = `TRK-${String(truckCount + 1).padStart(3, '0')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-base">🚛 Add New Truck</h3>
            <p className="text-slate-400 text-xs mt-0.5">Fill in the truck details below</p>
          </div>
          <button
            id="add-truck-modal-close"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* ── Required ─────────────────────────────────────── */}
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Required</p>

          <Field label="Number Plate" required>
            <input
              id="add-truck-plate"
              type="text"
              placeholder="DL 01 AB 1234"
              value={form.plateNumber}
              onChange={(e) => { set('plateNumber', e.target.value.toUpperCase()); setError(''); }}
              className="input-field text-sm"
            />
          </Field>

          {/* ── Truck Info ───────────────────────────────────── */}
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide pt-1">Truck Info</p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Truck Name">
              <input
                id="add-truck-name"
                type="text"
                placeholder={defaultName}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input-field text-sm"
              />
            </Field>
            <Field label="Year">
              <input
                id="add-truck-year"
                type="number"
                placeholder="2022"
                min="1990"
                max={new Date().getFullYear()}
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                className="input-field text-sm"
              />
            </Field>
          </div>

          <Field label="Model / Make">
            <input
              id="add-truck-model"
              type="text"
              placeholder="e.g. Tata Prima 4928.S"
              value={form.model}
              onChange={(e) => set('model', e.target.value)}
              className="input-field text-sm"
            />
          </Field>

          <Field label="Insurance Expiry Date">
            <input
              id="add-truck-insurance"
              type="date"
              value={form.insuranceExpiry}
              onChange={(e) => set('insuranceExpiry', e.target.value)}
              className="input-field text-sm"
              style={{ colorScheme: 'dark' }}
            />
          </Field>

          <Field label="Owner / Company Name">
            <input
              id="add-truck-owner"
              type="text"
              placeholder="Optional"
              value={form.ownerName}
              onChange={(e) => set('ownerName', e.target.value)}
              className="input-field text-sm"
            />
          </Field>

          {/* ── Driver Info ──────────────────────────────────── */}
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide pt-1">
            Driver Info <span className="text-slate-600 normal-case font-normal">(optional)</span>
          </p>

          <Field label="Driver Name">
            <input
              id="add-truck-driver"
              type="text"
              placeholder="Full name"
              value={form.driver}
              onChange={(e) => set('driver', e.target.value)}
              className="input-field text-sm"
            />
          </Field>

          <Field label="Driver Phone">
            <input
              id="add-truck-driver-phone"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit number"
              maxLength={10}
              value={form.driverPhone}
              onChange={(e) => set('driverPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input-field text-sm"
            />
          </Field>
        </div>

        {error && (
          <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-5">
          <button id="add-truck-cancel" onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
          <button id="add-truck-save"   onClick={handleSave} className="btn-primary flex-1 text-sm">Add Truck</button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Remove Modal ───────────────────────────────────────────
function ConfirmRemoveModal({ truck, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <p className="text-4xl mb-3">⚠️</p>
          <h3 className="text-white font-bold text-base">Remove {truck.name}?</h3>
          <p className="text-slate-400 text-sm mt-1">
            {truck.plateNumber} will be permanently removed from the fleet.
          </p>
        </div>
        <div className="flex gap-3">
          <button id="remove-cancel"  onClick={onClose}    className="btn-ghost flex-1 text-sm">Cancel</button>
          <button
            id="remove-confirm"
            onClick={onConfirm}
            className="flex-1 text-sm bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold rounded-xl px-5 py-2.5 transition-all shadow-lg shadow-rose-900/40"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Info Row ───────────────────────────────────────────────────────
function InfoRow({ icon, label, mono, warn, dim }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-sm leading-none shrink-0">{icon}</span>
      <span className={`truncate ${mono ? 'font-mono' : ''} ${
        warn ? 'text-amber-300' : dim ? 'text-slate-600' : 'text-slate-400'
      }`}>
        {label}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function TruckManagement() {
  const { trucks, addTruck, removeTruck, truckDistances, updateStatus } = useTrucks();
  const [showAdd, setShowAdd]           = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [expandedTruck, setExpandedTruck] = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = (data) => {
    addTruck(data);
    setShowAdd(false);
    showToast(`${data.plateNumber || 'Truck'} added to fleet ✅`);
  };

  const handleRemove = () => {
    removeTruck(removeTarget.id);
    showToast(`${removeTarget.name} removed`, 'error');
    setRemoveTarget(null);
  };

  const handleStatusChange = (truckId, newStatus) => {
    updateStatus(truckId, newStatus);
    setExpandedTruck(null);
    showToast(`Status → ${newStatus}`);
  };

  // Insurance alert banner
  const alertTrucks = trucks.filter((t) => {
    if (!t.insuranceExpiry) return false;
    return Math.ceil((new Date(t.insuranceExpiry) - new Date()) / 86400000) <= 30;
  });

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-16 right-4 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl animate-slide-up ${
          toast.type === 'error'
            ? 'bg-rose-900/80 border border-rose-600/40 text-rose-200'
            : 'bg-emerald-900/80 border border-emerald-600/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? '🗑️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Fleet Management</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {trucks.length} truck{trucks.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          id="add-truck-btn"
          onClick={() => setShowAdd(true)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <span className="text-lg font-light leading-none">+</span> Add Truck
        </button>
      </div>

      {/* Insurance expiry banner */}
      {alertTrucks.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-amber-700/30 bg-amber-900/10 animate-fade-in">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide mb-2.5">
            ⚠️ Insurance Alerts ({alertTrucks.length})
          </p>
          <div className="space-y-2">
            {alertTrucks.map((t) => {
              const ins = insuranceInfo(t.insuranceExpiry);
              return (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{t.name} · <span className="font-mono">{t.plateNumber}</span></span>
                  <span className={`font-semibold ${ins.color === 'rose' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {ins.icon} {ins.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Truck cards */}
      {trucks.length === 0 ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center text-slate-600">
          <p className="text-5xl mb-3">🚛</p>
          <p className="text-base font-medium text-slate-500">No trucks in fleet</p>
          <p className="text-sm mt-1">Click "Add Truck" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {trucks.map((truck) => {
            const dist   = truckDistances.find((d) => d.id === truck.id);
            const ins    = insuranceInfo(truck.insuranceExpiry);
            const isOpen = expandedTruck === truck.id;

            return (
              <div
                key={truck.id}
                id={`fleet-truck-${truck.id}`}
                className={`glass rounded-2xl p-5 transition-all duration-200 ${
                  isOpen ? 'ring-2 ring-brand-500/50 bg-white/[0.07]' : 'hover:bg-white/[0.06]'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/30 to-indigo-700/30 border border-brand-500/20 flex items-center justify-center text-lg shrink-0">
                      🚛
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">{truck.name}</p>
                      <p className="text-slate-400 text-xs font-mono">{truck.plateNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 mb-3">
                  {(truck.model || truck.year) && (
                    <InfoRow icon="🔧" label={[truck.model, truck.year].filter(Boolean).join(' · ')} />
                  )}
                  {truck.ownerName
                    ? <InfoRow icon="🏢" label={truck.ownerName} />
                    : <InfoRow icon="🏢" label="No owner set" dim />
                  }
                  {truck.driver
                    ? <InfoRow icon="👤" label={truck.driver} />
                    : <InfoRow icon="👤" label="No driver assigned" dim />
                  }
                  {truck.driverPhone && <InfoRow icon="📞" label={truck.driverPhone} mono />}
                  <InfoRow
                    icon={ins.icon}
                    label={truck.insuranceExpiry
                      ? `Insurance · ${ins.label} (${truck.insuranceExpiry})`
                      : 'Insurance · Not set'}
                    warn={!!truck.insuranceExpiry && ins.color !== 'emerald'}
                    dim={!truck.insuranceExpiry}
                  />
                  <InfoRow
                    icon={dist?.inside ? '✅' : '⚠️'}
                    label={dist ? `${dist.inside ? 'In zone' : 'Out of zone'} · ${dist.distKm.toFixed(1)} km` : '—'}
                    warn={dist && !dist.inside}
                  />
                  <InfoRow icon="🕒" label={`Updated ${fmtTime(truck.lastUpdated)}`} />
                </div>

                {/* Status toggle */}
                <div
                  className="flex items-center justify-between cursor-pointer py-2 border-t border-white/8"
                  onClick={() => setExpandedTruck(isOpen ? null : truck.id)}
                >
                  <span className="text-xs text-brand-400 font-medium">
                    {isOpen ? 'Close' : 'Update Status'}
                  </span>
                  <span className={`text-slate-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </div>

                {isOpen && (
                  <div className="pt-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {TRUCK_STATUSES.map((s) => (
                        <button
                          key={s}
                          id={`fleet-status-${truck.id}-${s}`}
                          disabled={truck.status === s}
                          onClick={() => handleStatusChange(truck.id, s)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all border ${
                            truck.status === s
                              ? 'border-brand-500/50 bg-brand-600/30 text-brand-200 cursor-default'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {s}
                          {truck.status === s && <span className="ml-auto text-[9px] text-brand-300">Current</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remove */}
                <button
                  id={`remove-truck-${truck.id}`}
                  onClick={() => setRemoveTarget(truck)}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium bg-rose-900/20 border border-rose-700/20 text-rose-400 hover:bg-rose-900/40 hover:text-rose-300 transition-all"
                >
                  🗑️ Remove Truck
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddTruckModal
          truckCount={trucks.length}
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}
      {removeTarget && (
        <ConfirmRemoveModal
          truck={removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={handleRemove}
        />
      )}
    </div>
  );
}
