import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useTrucks } from '../../context/TruckContext';
import { OFFICE_LOCATION, fmtTime } from '../../data/mockData';
import StatusBadge from '../Common/StatusBadge';

// ── Fix Leaflet default icon paths ──────────────────────────────────
if (L && L.Icon && L.Icon.Default) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// ── Status → color map for DivIcon ──────────────────────────────────
const STATUS_HEX = {
  Idle: '#94a3b8',
  Loading: '#22d3ee',
  Unloading: '#fbbf24',
  Incoming: '#34d399',
  Outgoing: '#f87171',
  Service: '#a78bfa',
};

function truckIcon(status) {
  const color = STATUS_HEX[status] ?? '#94a3b8';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="10" fill="${color}"/>
      <text x="20" y="25" font-size="14" text-anchor="middle" font-family="sans-serif">🚛</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

function officeIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">
      <circle cx="18" cy="18" r="16" fill="#2563eb" fill-opacity="0.25" stroke="#2563eb" stroke-width="2"/>
      <text x="18" y="23" font-size="14" text-anchor="middle" font-family="sans-serif">🏭</text>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20] });
}

export default function TruckMap({ showRadiusControl = false }) {
  const { trucks, truckDistances, geofenceRadiusKm, setGeofenceRadiusKm } = useTrucks();

  const center = [OFFICE_LOCATION.lat, OFFICE_LOCATION.lng];

  return (
    <div className="relative w-full h-full">
      {showRadiusControl && (
        <div className="absolute top-3 right-3 z-[1000] glass rounded-xl px-3.5 py-2.5 flex items-center gap-3 shadow-lg">
          <label htmlFor="geofence-radius" className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide whitespace-nowrap">
            Geofence
          </label>
          <input
            id="geofence-radius"
            type="range"
            min="1"
            max="50"
            value={geofenceRadiusKm}
            onChange={(e) => setGeofenceRadiusKm(Number(e.target.value))}
            className="w-24 accent-brand-400"
          />
          <span className="text-xs font-bold text-brand-300 tabular-nums w-12 text-right">{geofenceRadiusKm} km</span>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={12}
        style={{ width: '100%', height: '100%', minHeight: 340 }}
        className="rounded-xl"
      >
        {/* Dark tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        {/* Geofence circle */}
        <Circle
          center={center}
          radius={geofenceRadiusKm * 1000}
          pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.06, weight: 1.5, dashArray: '6 4' }}
        />

        {/* Office marker */}
        <Marker position={center} icon={officeIcon()}>
          <Popup>
            <div className="text-sm text-white">
              <p className="font-bold text-brand-300 mb-1">🏭 {OFFICE_LOCATION.name}</p>
              <p className="text-slate-400 text-xs">Geofence radius: {geofenceRadiusKm} km</p>
            </div>
          </Popup>
        </Marker>

        {/* Truck markers */}
        {trucks.map((truck) => {
          const distInfo = truckDistances.find((d) => d.id === truck.id);
          return (
            <Marker key={truck.id} position={[truck.lat, truck.lng]} icon={truckIcon(truck.status)}>
              <Popup>
                <div className="space-y-1.5 min-w-[160px]">
                  <p className="font-bold text-white text-sm">{truck.name}</p>
                  <p className="text-slate-400 text-xs">{truck.plateNumber}</p>
                  <p className="text-slate-400 text-xs">Driver: {truck.driver}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={truck.status} size="sm" />
                  </div>
                  {distInfo && (
                    <p className="text-xs text-slate-400">
                      {distInfo.inside ? '✅ Inside' : '⚠️ Outside'} geofence
                      &nbsp;({distInfo.distKm.toFixed(2)} km)
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500">Updated {fmtTime(truck.lastUpdated)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
