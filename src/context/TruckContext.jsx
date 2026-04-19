import {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react';
import {
  INITIAL_TRUCKS, OFFICE_LOCATION,
  GEOFENCE_RADIUS_KM, haversineKm,
} from '../data/mockData';

const TruckContext = createContext(null);

export function TruckProvider({ children }) {
  const [trucks, setTrucks] = useState(() => {
    try {
      const stored = localStorage.getItem('tf_trucks');
      return stored ? JSON.parse(stored) : INITIAL_TRUCKS;
    } catch {
      return INITIAL_TRUCKS;
    }
  });

  const [alerts, setAlerts] = useState([]);
  const alertIdRef = useRef(0);

  // Persist trucks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tf_trucks', JSON.stringify(trucks));
  }, [trucks]);

  // ── Add an alert entry ─────────────────────────────────────────
  const addAlert = useCallback((alert) => {
    alertIdRef.current += 1;
    setAlerts((prev) => [
      { id: alertIdRef.current, time: new Date().toISOString(), ...alert },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // ── Update truck status ────────────────────────────────────────
  const updateStatus = useCallback(
    (truckId, newStatus) => {
      setTrucks((prev) => {
        const truck = prev.find((t) => t.id === truckId);
        if (truck) {
          addAlert({
            type: 'status',
            truck: truck.name,
            message: `${truck.name} status changed to ${newStatus}`,
            newStatus,
          });
        }
        return prev.map((t) =>
          t.id === truckId
            ? { ...t, status: newStatus, lastUpdated: new Date().toISOString() }
            : t
        );
      });
    },
    [addAlert]
  );

  // ── Update truck location manually ────────────────────────────
  const updateLocation = useCallback(
    (truckId, lat, lng) => {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (isNaN(latNum) || isNaN(lngNum)) return { ok: false, error: 'Invalid coordinates' };

      setTrucks((prev) => {
        const truck = prev.find((t) => t.id === truckId);
        const dist = haversineKm(latNum, lngNum, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
        const inside = dist <= GEOFENCE_RADIUS_KM;
        if (truck) {
          addAlert({
            type: 'geofence',
            truck: truck.name,
            message: `${truck.name} location updated · ${inside ? '✅ Inside' : '⚠️ Outside'} geofence (${dist.toFixed(1)} km)`,
          });
        }
        return prev.map((t) =>
          t.id === truckId
            ? { ...t, lat: latNum, lng: lngNum, lastUpdated: new Date().toISOString() }
            : t
        );
      });

      return { ok: true };
    },
    [addAlert]
  );

  // ── Computed geofence distances ────────────────────────────────
  const truckDistances = trucks.map((t) => {
    const distKm = haversineKm(t.lat, t.lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    return { id: t.id, distKm, inside: distKm <= GEOFENCE_RADIUS_KM };
  });

  return (
    <TruckContext.Provider value={{ trucks, alerts, updateStatus, updateLocation, truckDistances }}>
      {children}
    </TruckContext.Provider>
  );
}

export const useTrucks = () => useContext(TruckContext);
