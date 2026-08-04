import {
  createContext, useContext, useState,
  useEffect, useCallback,
} from 'react';
import {
  OFFICE_LOCATION,
  GEOFENCE_RADIUS_KM, haversineKm,
  INITIAL_TRUCKS,
} from '../data/mockData';

const TruckContext = createContext(null);

export function TruckProvider({ children }) {
  // ── Trucks state (synced to localStorage) ───────────────────────
  const [trucks, setTrucks] = useState(() => {
    try {
      const stored = localStorage.getItem('tf_trucks');
      return stored ? JSON.parse(stored) : INITIAL_TRUCKS;
    } catch {
      return INITIAL_TRUCKS;
    }
  });

  // ── Alerts state (synced to localStorage) ───────────────────────
  const [alerts, setAlerts] = useState(() => {
    try {
      const stored = localStorage.getItem('tf_alerts');
      return stored ? JSON.parse(stored) : [
        {
          id: 'alt-1',
          truck_id: 'tk1',
          truck_name: 'TRK-001',
          type: 'geofence',
          message: 'TRK-001 location updated · ✅ Inside geofence (0.7 km)',
          created_at: new Date().toISOString(),
        },
        {
          id: 'alt-2',
          truck_id: 'tk2',
          truck_name: 'TRK-002',
          type: 'status',
          message: 'TRK-002 status changed to Loading',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // ── Geofence radius (user-configurable, synced to localStorage) ──
  const [geofenceRadiusKm, setGeofenceRadiusKmState] = useState(() => {
    const stored = parseFloat(localStorage.getItem('tf_geofence_km'));
    return Number.isFinite(stored) && stored > 0 ? stored : GEOFENCE_RADIUS_KM;
  });

  const setGeofenceRadiusKm = useCallback((km) => {
    const val = Math.min(200, Math.max(1, Math.round(km)));
    setGeofenceRadiusKmState(val);
    try {
      localStorage.setItem('tf_geofence_km', String(val));
    } catch (err) {
      console.warn('LocalStorage save failed for geofence radius:', err);
    }
  }, []);

  const [loading, setLoading] = useState(false);

  // Sync trucks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tf_trucks', JSON.stringify(trucks));
    } catch (err) {
      console.warn('LocalStorage save failed for trucks:', err);
    }
  }, [trucks]);

  // Sync alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tf_alerts', JSON.stringify(alerts));
    } catch (err) {
      console.warn('LocalStorage save failed for alerts:', err);
    }
  }, [alerts]);

  // ── Add alert ───────────────────────────────────────────────────
  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      truck_id: alert.truckId ?? null,
      truck_name: alert.truck,
      type: alert.type,
      message: alert.message,
      created_at: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);
  }, []);

  // ── Update truck status ─────────────────────────────────────────
  const updateStatus = useCallback((truckId, newStatus) => {
    setTrucks((prev) => {
      const target = prev.find((t) => t.id === truckId);
      if (!target) return prev;
      return prev.map((t) =>
        t.id === truckId ? { ...t, status: newStatus, lastUpdated: new Date().toISOString() } : t
      );
    });

    const truck = trucks.find((t) => t.id === truckId);
    if (truck) {
      addAlert({
        truckId,
        truck: truck.name,
        type: 'status',
        message: `${truck.name} status changed to ${newStatus}`,
      });
    }
  }, [trucks, addAlert]);

  // ── Update truck location ───────────────────────────────────────
  const updateLocation = useCallback((truckId, lat, lng) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return { ok: false, error: 'Invalid coordinates' };

    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truckId ? { ...t, lat: latNum, lng: lngNum, lastUpdated: new Date().toISOString() } : t
      )
    );

    const dist = haversineKm(latNum, lngNum, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    const inside = dist <= geofenceRadiusKm;
    const truck = trucks.find((t) => t.id === truckId);
    if (truck) {
      addAlert({
        truckId,
        truck: truck.name,
        type: 'geofence',
        message: `${truck.name} location updated · ${inside ? '✅ Inside' : '⚠️ Outside'} geofence (${dist.toFixed(1)} km)`,
      });
    }
    return { ok: true };
  }, [trucks, addAlert, geofenceRadiusKm]);

  // ── Add a new truck ─────────────────────────────────────────────
  const addTruck = useCallback((data) => {
    const newId = `tk${Date.now()}`;
    const newTruck = {
      id: newId,
      name: data.name?.trim() || `TRK-${String(Date.now()).slice(-3)}`,
      plateNumber: data.plateNumber.trim(),
      model: data.model?.trim() || '',
      year: data.year ? parseInt(data.year) : null,
      ownerName: data.ownerName?.trim() || '',
      driver: data.driver?.trim() || '',
      driverPhone: data.driverPhone?.trim() || '',
      insuranceExpiry: data.insuranceExpiry || '',
      status: 'Idle',
      lat: OFFICE_LOCATION.lat,
      lng: OFFICE_LOCATION.lng,
      lastUpdated: new Date().toISOString(),
      documents: [],
    };

    setTrucks((prev) => [newTruck, ...prev]);

    addAlert({
      truckId: newId,
      truck: newTruck.name,
      type: 'status',
      message: `${newTruck.name} (${newTruck.plateNumber}) added to fleet`,
    });
  }, [addAlert]);

  // ── Edit a truck ────────────────────────────────────────────────
  const editTruck = useCallback((truckId, data) => {
    const truck = trucks.find((t) => t.id === truckId);
    if (!truck) return;

    const updatedName = data.name?.trim() || truck.name;

    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truckId
          ? {
              ...t,
              name: updatedName,
              plateNumber: data.plateNumber?.trim() || t.plateNumber,
              model: data.model?.trim() ?? t.model,
              year: data.year ? parseInt(data.year) : t.year,
              ownerName: data.ownerName?.trim() ?? t.ownerName,
              driver: data.driver?.trim() ?? t.driver,
              driverPhone: data.driverPhone?.trim() ?? t.driverPhone,
              insuranceExpiry: data.insuranceExpiry ?? t.insuranceExpiry,
              lastUpdated: new Date().toISOString(),
            }
          : t
      )
    );

    addAlert({
      truckId,
      truck: updatedName,
      type: 'status',
      message: `${updatedName} details updated`,
    });
  }, [trucks, addAlert]);

  // ── Remove a truck ──────────────────────────────────────────────
  const removeTruck = useCallback((truckId) => {
    const truck = trucks.find((t) => t.id === truckId);
    setTrucks((prev) => prev.filter((t) => t.id !== truckId));

    if (truck) {
      addAlert({
        truckId,
        truck: truck.name,
        type: 'status',
        message: `${truck.name} removed from fleet`,
      });
    }
  }, [trucks, addAlert]);

  // ── Add a document (Local Data URL / Object URL) ────────────────
  const addDocument = useCallback(async (truckId, docData) => {
    if (!docData.file || !(docData.file instanceof File)) {
      return { ok: false, error: 'No file provided' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const publicUrl = reader.result;
        const newDoc = {
          id: `doc-${Date.now()}`,
          title: docData.title,
          type: docData.type,
          publicUrl,
          storagePath: docData.file.name,
          date: new Date().toISOString(),
        };

        setTrucks((prev) =>
          prev.map((t) =>
            t.id === truckId ? { ...t, documents: [...(t.documents || []), newDoc] } : t
          )
        );
        resolve({ ok: true });
      };
      reader.onerror = () => resolve({ ok: false, error: 'Failed to read document' });
      reader.readAsDataURL(docData.file);
    });
  }, []);

  // ── Remove a document ───────────────────────────────────────────
  const removeDocument = useCallback((truckId, docId) => {
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === truckId
          ? { ...t, documents: (t.documents || []).filter((d) => d.id !== docId) }
          : t
      )
    );
  }, []);

  // ── Computed geofence distances ─────────────────────────────────
  const truckDistances = trucks.map((t) => {
    const distKm = haversineKm(t.lat, t.lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    return { id: t.id, distKm, inside: distKm <= geofenceRadiusKm };
  });

  return (
    <TruckContext.Provider
      value={{
        trucks,
        alerts,
        loading,
        addTruck,
        removeTruck,
        editTruck,
        updateStatus,
        updateLocation,
        truckDistances,
        addDocument,
        removeDocument,
        geofenceRadiusKm,
        setGeofenceRadiusKm,
      }}
    >
      {children}
    </TruckContext.Provider>
  );
}

export const useTrucks = () => useContext(TruckContext);
