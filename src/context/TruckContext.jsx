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
      const stored = localStorage.getItem('tf_trucks_v2');
      return stored ? JSON.parse(stored) : INITIAL_TRUCKS;
    } catch {
      return INITIAL_TRUCKS;
    }
  });

  const [alerts, setAlerts] = useState([]);
  const alertIdRef = useRef(0);

  // Persist trucks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tf_trucks_v2', JSON.stringify(trucks));
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
  // ── Add a new truck ────────────────────────────────────────────
  const addTruck = useCallback((data) => {
    setTrucks((prev) => {
      const newTruck = {
        id: `tk${Date.now()}`,
        name: data.name?.trim() || `TRK-${String(prev.length + 1).padStart(3, '0')}`,
        plateNumber: data.plateNumber.trim(),
        model: data.model?.trim() || '',
        year: data.year ? parseInt(data.year) : '',
        ownerName: data.ownerName?.trim() || '',
        driver: data.driver?.trim() || '',
        driverPhone: data.driverPhone?.trim() || '',
        insuranceExpiry: data.insuranceExpiry || '',
        status: 'Idle',
        lat: OFFICE_LOCATION.lat,
        lng: OFFICE_LOCATION.lng,
        lastUpdated: new Date().toISOString(),
      };
      addAlert({ type: 'status', truck: newTruck.name, message: `${newTruck.name} (${newTruck.plateNumber}) added to fleet` });
      return [...prev, newTruck];
    });
  }, [addAlert]);

  // ── Edit a truck ───────────────────────────────────────────────
  const editTruck = useCallback((truckId, data) => {
    setTrucks((prev) => {
      const truck = prev.find((t) => t.id === truckId);
      if (truck) {
        addAlert({ type: 'status', truck: data.name || truck.name, message: `${data.name || truck.name} details updated` });
      }
      return prev.map((t) =>
        t.id === truckId
          ? {
              ...t,
              name: data.name?.trim() || t.name,
              plateNumber: data.plateNumber?.trim() || t.plateNumber,
              model: data.model?.trim() || '',
              year: data.year ? parseInt(data.year) : '',
              ownerName: data.ownerName?.trim() || '',
              driver: data.driver?.trim() || '',
              driverPhone: data.driverPhone?.trim() || '',
              insuranceExpiry: data.insuranceExpiry || '',
              lastUpdated: new Date().toISOString(),
            }
          : t
      );
    });
  }, [addAlert]);

  // ── Remove a truck ─────────────────────────────────────────────
  const removeTruck = useCallback((truckId) => {
    setTrucks((prev) => {
      const truck = prev.find((t) => t.id === truckId);
      if (truck) {
        addAlert({ type: 'status', truck: truck.name, message: `${truck.name} removed from fleet` });
      }
      return prev.filter((t) => t.id !== truckId);
    });
  }, [addAlert]);

  // ── Document Management ────────────────────────────────────────
  const addDocument = useCallback((truckId, docData) => {
    setTrucks((prev) => prev.map(t => {
      if (t.id === truckId) {
        const newDoc = { id: `doc${Date.now()}`, date: new Date().toISOString(), ...docData };
        return { ...t, documents: [...(t.documents || []), newDoc] };
      }
      return t;
    }));
  }, []);

  const removeDocument = useCallback((truckId, docId) => {
    setTrucks((prev) => prev.map(t => {
      if (t.id === truckId) {
        return { ...t, documents: (t.documents || []).filter(d => d.id !== docId) };
      }
      return t;
    }));
  }, []);

  // ── Computed geofence distances ────────────────────────────────
  const truckDistances = trucks.map((t) => {
    const distKm = haversineKm(t.lat, t.lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    return { id: t.id, distKm, inside: distKm <= GEOFENCE_RADIUS_KM };
  });

  return (
    <TruckContext.Provider value={{ trucks, alerts, addTruck, removeTruck, editTruck, updateStatus, updateLocation, truckDistances, addDocument, removeDocument }}>
      {children}
    </TruckContext.Provider>
  );
}

export const useTrucks = () => useContext(TruckContext);
