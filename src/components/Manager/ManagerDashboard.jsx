import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTrucks } from '../../context/TruckContext';
import { TRUCK_STATUSES, fmtTime } from '../../data/mockData';
import StatusBadge from '../Common/StatusBadge';
import TruckMap from '../Admin/TruckMap';
import UploadsList from '../Common/UploadsList';

const STATUS_ICONS = {
  Idle:      '⏸️',
  Loading:   '📦',
  Unloading: '📤',
  Incoming:  '➡️',
  Outgoing:  '🚀',
};

// ── Set Location Modal ────────────────────────────────────────────
function LocationModal({ truck, onClose, onSave }) {
  const [lat, setLat] = useState(String(truck.lat));
  const [lng, setLng] = useState(String(truck.lng));
  const [error, setError] = useState('');

  const PRESETS = [
    { label: 'Delhi',     lat: '28.6139', lng: '77.2090' },
    { label: 'Mumbai',    lat: '19.0760', lng: '72.8777' },
    { label: 'Bangalore', lat: '12.9716', lng: '77.5946' },
    { label: 'Chennai',   lat: '13.0827', lng: '80.2707' },
    { label: 'Hyderabad', lat: '17.3850', lng: '78.4867' },
    { label: 'Kolkata',   lat: '22.5726', lng: '88.3639' },
    { label: 'Pune',      lat: '18.5204', lng: '73.8567' },
    { label: 'Ahmedabad', lat: '23.0225', lng: '72.5714' },
  ];

  const handleSave = () => {
    const latN = parseFloat(lat);
    const lngN = parseFloat(lng);
    if (isNaN(latN) || latN < -90 || latN > 90)  { setError('Latitude must be between -90 and 90.');  return; }
    if (isNaN(lngN) || lngN < -180 || lngN > 180) { setError('Longitude must be between -180 and 180.'); return; }
    onSave(latN, lngN);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-base">📍 Set Location</h3>
            <p className="text-slate-400 text-xs mt-0.5">{truck.name} · {truck.plateNumber}</p>
          </div>
          <button id="location-modal-close" onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all flex items-center justify-center text-sm">
            ✕
          </button>
        </div>

        {/* City presets */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">Quick Select City</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                id={`preset-${p.label.toLowerCase()}`}
                onClick={() => { setLat(p.lat); setLng(p.lng); setError(''); }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                  lat === p.lat && lng === p.lng
                    ? 'bg-brand-600/40 border-brand-500/50 text-brand-200'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual lat/lng inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wide block mb-1">
              Latitude
            </label>
            <input
              id="location-lat-input"
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => { setLat(e.target.value); setError(''); }}
              placeholder="e.g. 28.6139"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wide block mb-1">
              Longitude
            </label>
            <input
              id="location-lng-input"
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => { setLng(e.target.value); setError(''); }}
              placeholder="e.g. 77.2090"
              className="input-field text-sm"
            />
          </div>
        </div>

        {error && (
          <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {/* Tips */}
        <p className="text-slate-600 text-xs mb-4 leading-relaxed">
          💡 Tip: You can get coordinates from Google Maps by right-clicking any location.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button id="location-cancel-btn" onClick={onClose} className="btn-ghost flex-1 text-sm">
            Cancel
          </button>
          <button id="location-save-btn" onClick={handleSave} className="btn-primary flex-1 text-sm">
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function ManagerDashboard({ compact = false }) {
  const { user } = useAuth();
  const { trucks, updateStatus, updateLocation, truckDistances, addUpload } = useTrucks();
  const [activeTab, setActiveTab]               = useState('trucks');
  const [expandedTruck, setExpandedTruck]        = useState(null);
  const [locationTruck, setLocationTruck]        = useState(null);
  const [updating, setUpdating]                  = useState(false);
  const [photoFile, setPhotoFile]                = useState(null);    // actual File for upload
  const [photoPreview, setPhotoPreview]          = useState(null);    // base64 for display
  const [toast, setToast]                        = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (truckId, newStatus) => {
    setUpdating(true);
    const truck = trucks.find((t) => t.id === truckId);
    await updateStatus(truckId, newStatus);
    if (photoFile) {
      const result = await addUpload(truckId, truck?.name, photoFile, newStatus, user?.role, user?.name);
      if (!result?.ok) showToast('Photo upload failed', 'error');
    }
    showToast(`${truck?.name} → ${newStatus}`);
    setExpandedTruck(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setUpdating(false);
  };

  const handleExpand = (truckId) => {
    if (expandedTruck === truckId) {
      setExpandedTruck(null);
      setPhotoFile(null);
      setPhotoPreview(null);
    } else {
      setExpandedTruck(truckId);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleLocationSave = async (lat, lng) => {
    const result = await updateLocation(locationTruck.id, lat, lng);
    if (result?.ok === false) { showToast(result.error, 'error'); return; }
    showToast(`${locationTruck.name} location updated ✅`);
    setLocationTruck(null);
  };

  return (
    <div className={`flex-1 overflow-y-auto space-y-6 animate-fade-in ${compact ? 'pt-2' : 'p-4 md:p-6'}`}>
      {/* Header – hidden in compact/tab mode */}
      {!compact && (
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Trucks</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Tap a truck to update status or location · {trucks.length} trucks total
          </p>
        </div>
      )}

      {/* Tab switcher (only when not compact/nested) */}
      {!compact && (
        <div className="flex gap-2 border-b border-white/8 overflow-x-auto scrollbar-hide pb-0">
          {[
            { id: 'trucks', label: 'My Trucks' },
            { id: 'uploads', label: '📷 Uploads' },
            { id: 'map', label: '🗺️ Live Map' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`manager-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-brand-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Uploads tab */}
      {!compact && activeTab === 'uploads' && (
        <UploadsList />
      )}

      {/* Live Map tab */}
      {!compact && activeTab === 'map' && (
        <div className="glass rounded-2xl p-3 h-[520px] animate-fade-in">
          <TruckMap />
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-16 right-4 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl animate-slide-up ${
          toast.type === 'error'
            ? 'bg-rose-900/80 border border-rose-600/40 text-rose-200'
            : 'bg-emerald-900/80 border border-emerald-600/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* Truck cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {trucks.map((truck) => {
          const dist    = truckDistances.find((d) => d.id === truck.id);
          const isOpen  = expandedTruck === truck.id;

          return (
            <div
              key={truck.id}
              id={`manager-truck-${truck.id}`}
              className={`glass rounded-2xl p-5 transition-all duration-200
                ${isOpen ? 'ring-2 ring-brand-500/50 bg-white/[0.07]' : 'hover:bg-white/[0.06]'}`}
            >
              {/* Card header – click to expand status */}
              <div
                className="cursor-pointer"
                onClick={() => handleExpand(truck.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600/30 to-indigo-700/30 border border-brand-500/20 flex items-center justify-center text-xl">
                      🚛
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{truck.name}</p>
                      <p className="text-slate-500 text-xs">{truck.plateNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 mb-4">
                  <InfoRow icon="👤" label={truck.driver} />
                  <InfoRow
                    icon={dist?.inside ? '✅' : '⚠️'}
                    label={dist ? `${dist.inside ? 'In zone' : 'Out of zone'} · ${dist.distKm.toFixed(1)} km` : '—'}
                    warn={dist && !dist.inside}
                  />
                  <InfoRow icon="📍" label={`${truck.lat.toFixed(4)}, ${truck.lng.toFixed(4)}`} mono />
                  <InfoRow icon="🕒" label={`Updated ${fmtTime(truck.lastUpdated)}`} />
                </div>

                {/* Expand hint */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-400 font-medium">
                    {isOpen ? 'Close' : 'Update Status'}
                  </span>
                  <span className={`text-slate-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </div>

              {/* Set Location button (always visible) */}
              <button
                id={`set-location-btn-${truck.id}`}
                onClick={(e) => { e.stopPropagation(); setLocationTruck(truck); }}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium
                           bg-indigo-900/30 border border-indigo-700/30 text-indigo-300
                           hover:bg-indigo-900/50 hover:text-white transition-all"
              >
                📍 Set Location Manually
              </button>

              {/* Status chooser (expanded) */}
              {isOpen && (
                <div
                  className="mt-4 pt-4 border-t border-white/8 animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Photo Upload */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400 font-medium">Attach Photo (Optional):</p>
                      {photoPreview && (
                        <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors">
                          Clear
                        </button>
                      )}
                    </div>
                    
                    {photoPreview ? (
                      <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 group">
                        <img src={photoPreview} alt="Selected" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-xs font-medium text-white">Selected ✓</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {/* Camera */}
                        <label className="flex flex-col items-center justify-center h-16 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all bg-white/[0.02]">
                          <span className="text-lg mb-0.5">📸</span>
                          <span className="text-[10px] font-medium text-slate-300">Click Now</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment"
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setPhotoFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => setPhotoPreview(reader.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {/* Gallery Upload */}
                        <label className="flex flex-col items-center justify-center h-16 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all bg-white/[0.02]">
                          <span className="text-lg mb-0.5">📂</span>
                          <span className="text-[10px] font-medium text-slate-300">Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setPhotoFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => setPhotoPreview(reader.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-medium mb-3">Select new status:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TRUCK_STATUSES.map((s) => (
                      <button
                        key={s}
                        id={`status-btn-${truck.id}-${s}`}
                        disabled={truck.status === s || updating}
                        onClick={() => handleStatusChange(truck.id, s)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all border
                          ${truck.status === s
                            ? 'border-brand-500/50 bg-brand-600/30 text-brand-200 cursor-default'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                          }
                          disabled:opacity-50`
                        }
                      >
                        <span>{STATUS_ICONS[s]}</span>
                        {s}
                        {truck.status === s && <span className="ml-auto text-[9px] text-brand-300">Current</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status legend */}
      <div className="glass rounded-2xl p-4">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Status Guide</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TRUCK_STATUSES.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span className="text-lg">{STATUS_ICONS[s]}</span>
              <p className="text-xs text-slate-300 font-medium">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Location modal */}
      {locationTruck && (
        <LocationModal
          truck={locationTruck}
          onClose={() => setLocationTruck(null)}
          onSave={handleLocationSave}
        />
      )}
    </div>
  );
}

function InfoRow({ icon, label, mono, warn }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-base leading-none">{icon}</span>
      <span className={`${mono ? 'font-mono' : ''} ${warn ? 'text-amber-300' : 'text-slate-400'} truncate`}>
        {label}
      </span>
    </div>
  );
}
