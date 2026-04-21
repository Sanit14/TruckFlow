import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useTrucks } from '../../context/TruckContext';
import { OFFICE_LOCATION, GEOFENCE_RADIUS_KM, fmtTime } from '../../data/mockData';
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
  Loading: '#60a5fa',
  Unloading: '#fbbf24',
  Incoming: '#34d399',
  Outgoing: '#f87171',
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
      <circle cx="18" cy="18" r="16" fill="#6366f1" fill-opacity="0.25" stroke="#6366f1" stroke-width="2"/>
      <text x="18" y="23" font-size="14" text-anchor="middle" font-family="sans-serif">🏭</text>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20] });
}

export default function TruckMap() {
  const { trucks, truckDistances } = useTrucks();

  const center = [OFFICE_LOCATION.lat, OFFICE_LOCATION.lng];

  return (
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
        radius={GEOFENCE_RADIUS_KM * 1000}
        pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.06, weight: 1.5, dashArray: '6 4' }}
      />

      {/* Office marker */}
      <Marker position={center} icon={officeIcon()}>
        <Popup>
          <div className="text-sm text-white">
            <p className="font-bold text-brand-300 mb-1">🏭 {OFFICE_LOCATION.name}</p>
            <p className="text-slate-400 text-xs">Geofence radius: {GEOFENCE_RADIUS_KM} km</p>
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
  );
}
