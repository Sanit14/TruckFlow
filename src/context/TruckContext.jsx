import {
  createContext, useContext, useState,
  useEffect, useCallback,
} from 'react';
import { supabase } from '../lib/supabase';
import {
  OFFICE_LOCATION,
  GEOFENCE_RADIUS_KM, haversineKm,
} from '../data/mockData';

const TruckContext = createContext(null);

// ── DB row (snake_case) → frontend object (camelCase) ─────────────
function dbToTruck(row) {
  return {
    id:              row.id,
    name:            row.name,
    plateNumber:     row.plate_number,
    model:           row.model || '',
    year:            row.year || '',
    ownerName:       row.owner_name || '',
    driver:          row.driver || '',
    driverPhone:     row.driver_phone || '',
    insuranceExpiry: row.insurance_expiry || '',
    status:          row.status,
    lat:             row.lat,
    lng:             row.lng,
    lastUpdated:     row.last_updated,
    documents:       (row.documents || []).map(d => ({
      id:        d.id,
      title:     d.name,
      type:      d.type,
      publicUrl: d.public_url,
      storagePath: d.storage_path,
      date:      d.created_at,
    })),
  };
}

export function TruckProvider({ children }) {
  const [trucks,  setTrucks]  = useState([]);
  const [alerts,  setAlerts]  = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Load trucks + realtime ──────────────────────────────────────
  useEffect(() => {
    supabase
      .from('trucks')
      .select('*, documents(*)')
      .then(({ data, error }) => {
        if (error) console.error('Trucks load error:', error);
        if (data) setTrucks(data.map(dbToTruck));
        setLoading(false);
      });

    const truckChannel = supabase
      .channel('trucks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trucks' },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            setTrucks(prev => prev.filter(t => t.id !== payload.old.id));
          } else {
            // Re-fetch with documents joined
            const { data } = await supabase
              .from('trucks')
              .select('*, documents(*)')
              .eq('id', payload.new.id)
              .single();
            if (data) {
              setTrucks(prev => {
                const exists = prev.find(t => t.id === data.id);
                if (exists) return prev.map(t => t.id === data.id ? dbToTruck(data) : t);
                return [...prev, dbToTruck(data)];
              });
            }
          }
        })
      .subscribe();

    return () => supabase.removeChannel(truckChannel);
  }, []);

  // ── Load alerts + realtime ──────────────────────────────────────
  useEffect(() => {
    supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { if (data) setAlerts(data); });

    const alertChannel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          setAlerts(prev => [payload.new, ...prev.slice(0, 49)]);
        })
      .subscribe();

    return () => supabase.removeChannel(alertChannel);
  }, []);

  // ── Load uploads ────────────────────────────────────────────────
  useEffect(() => {
    supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setUploads(data.map(row => ({
          id:           row.id,
          truckId:      row.truck_id,
          truckName:    row.truck_name,
          photoData:    row.public_url,   // works directly as <img src>
          status:       row.status,
          uploaderRole: row.uploader_role,
          uploaderName: row.uploader_name,
          date:         row.created_at,
        })));
      });
  }, []);

  // ── Add alert (writes to DB, realtime pushes to all clients) ────
  const addAlert = useCallback(async (alert) => {
    await supabase.from('alerts').insert({
      truck_id:   alert.truckId ?? null,
      truck_name: alert.truck,
      type:       alert.type,
      message:    alert.message,
    });
  }, []);

  // ── Update truck status ─────────────────────────────────────────
  const updateStatus = useCallback(async (truckId, newStatus) => {
    const truck = trucks.find(t => t.id === truckId);
    const { error } = await supabase
      .from('trucks')
      .update({ status: newStatus, last_updated: new Date().toISOString() })
      .eq('id', truckId);

    if (!error && truck) {
      await addAlert({
        truckId,
        truck:   truck.name,
        type:    'status',
        message: `${truck.name} status changed to ${newStatus}`,
      });
    }
  }, [trucks, addAlert]);

  // ── Update truck location ───────────────────────────────────────
  const updateLocation = useCallback(async (truckId, lat, lng) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) return { ok: false, error: 'Invalid coordinates' };

    const { error } = await supabase
      .from('trucks')
      .update({ lat: latNum, lng: lngNum, last_updated: new Date().toISOString() })
      .eq('id', truckId);

    if (error) return { ok: false, error: error.message };

    const dist   = haversineKm(latNum, lngNum, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    const inside = dist <= GEOFENCE_RADIUS_KM;
    const truck  = trucks.find(t => t.id === truckId);
    if (truck) {
      await addAlert({
        truckId,
        truck:   truck.name,
        type:    'geofence',
        message: `${truck.name} location updated · ${inside ? '✅ Inside' : '⚠️ Outside'} geofence (${dist.toFixed(1)} km)`,
      });
    }
    return { ok: true };
  }, [trucks, addAlert]);

  // ── Add a new truck ─────────────────────────────────────────────
  const addTruck = useCallback(async (data) => {
    const newId = `tk${Date.now()}`;
    const payload = {
      id:               newId,
      name:             data.name?.trim() || `TRK-${String(Date.now()).slice(-3)}`,
      plate_number:     data.plateNumber.trim(),
      model:            data.model?.trim() || '',
      year:             data.year ? parseInt(data.year) : null,
      owner_name:       data.ownerName?.trim() || '',
      driver:           data.driver?.trim() || '',
      driver_phone:     data.driverPhone?.trim() || '',
      insurance_expiry: data.insuranceExpiry || null,
      status:           'Idle',
      lat:              OFFICE_LOCATION.lat,
      lng:              OFFICE_LOCATION.lng,
    };
    const { error } = await supabase.from('trucks').insert(payload);
    if (error) { console.error('Add truck error:', error); return; }
    await addAlert({
      truckId: newId,
      truck:   payload.name,
      type:    'status',
      message: `${payload.name} (${payload.plate_number}) added to fleet`,
    });
  }, [addAlert]);

  // ── Edit a truck ────────────────────────────────────────────────
  const editTruck = useCallback(async (truckId, data) => {
    const truck = trucks.find(t => t.id === truckId);
    const { error } = await supabase
      .from('trucks')
      .update({
        name:             data.name?.trim()        || truck?.name,
        plate_number:     data.plateNumber?.trim() || truck?.plateNumber,
        model:            data.model?.trim()        || '',
        year:             data.year ? parseInt(data.year) : null,
        owner_name:       data.ownerName?.trim()   || '',
        driver:           data.driver?.trim()       || '',
        driver_phone:     data.driverPhone?.trim()  || '',
        insurance_expiry: data.insuranceExpiry      || null,
        last_updated:     new Date().toISOString(),
      })
      .eq('id', truckId);

    if (!error) {
      await addAlert({
        truckId,
        truck:   data.name || truck?.name,
        type:    'status',
        message: `${data.name || truck?.name} details updated`,
      });
    }
  }, [trucks, addAlert]);

  // ── Remove a truck ──────────────────────────────────────────────
  const removeTruck = useCallback(async (truckId) => {
    const truck = trucks.find(t => t.id === truckId);
    await supabase.from('trucks').delete().eq('id', truckId);
    if (truck) {
      await addAlert({
        truckId,
        truck:   truck.name,
        type:    'status',
        message: `${truck.name} removed from fleet`,
      });
    }
  }, [trucks, addAlert]);

  // ── Add a photo upload → Supabase Storage ──────────────────────
  const addUpload = useCallback(async (truckId, truckName, file, status, uploaderRole, uploaderName) => {
    if (!file || !(file instanceof File)) return { ok: false, error: 'No file provided' };

    const ext         = file.name.split('.').pop();
    const storagePath = `${truckId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('truck-uploads')
      .upload(storagePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return { ok: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('truck-uploads')
      .getPublicUrl(storagePath);

    const { error: dbError } = await supabase.from('uploads').insert({
      truck_id:      truckId,
      truck_name:    truckName,
      status,
      storage_path:  storagePath,
      public_url:    publicUrl,
      uploader_role: uploaderRole,
      uploader_name: uploaderName,
    });

    if (!dbError) {
      setUploads(prev => [{
        id:           crypto.randomUUID(),
        truckId, truckName,
        photoData:    publicUrl,
        status, uploaderRole, uploaderName,
        date:         new Date().toISOString(),
      }, ...prev]);
    }
    return { ok: !dbError };
  }, []);

  // ── Add a document → Supabase Storage ──────────────────────────
  const addDocument = useCallback(async (truckId, docData) => {
    // docData = { title, type, file: File }
    if (!docData.file || !(docData.file instanceof File)) {
      return { ok: false, error: 'No file provided' };
    }

    const ext         = docData.file.name.split('.').pop();
    const storagePath = `${truckId}/${Date.now()}_${docData.type}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('truck-documents')
      .upload(storagePath, docData.file, { cacheControl: '3600', upsert: false });

    if (uploadError) return { ok: false, error: uploadError.message };

    const { data: { publicUrl } } = supabase.storage
      .from('truck-documents')
      .getPublicUrl(storagePath);

    const { data: inserted, error: dbError } = await supabase
      .from('documents')
      .insert({
        truck_id:     truckId,
        name:         docData.title,
        type:         docData.type,
        storage_path: storagePath,
        public_url:   publicUrl,
      })
      .select()
      .single();

    if (!dbError && inserted) {
      const newDoc = {
        id:          inserted.id,
        title:       inserted.name,
        type:        inserted.type,
        publicUrl:   inserted.public_url,
        storagePath: inserted.storage_path,
        date:        inserted.created_at,
      };
      setTrucks(prev => prev.map(t =>
        t.id === truckId ? { ...t, documents: [...(t.documents || []), newDoc] } : t
      ));
    }
    return { ok: !dbError };
  }, []);

  // ── Remove a document ───────────────────────────────────────────
  const removeDocument = useCallback(async (truckId, docId) => {
    const truck = trucks.find(t => t.id === truckId);
    const doc   = (truck?.documents || []).find(d => d.id === docId);

    if (doc?.storagePath) {
      await supabase.storage.from('truck-documents').remove([doc.storagePath]);
    }
    await supabase.from('documents').delete().eq('id', docId);

    setTrucks(prev => prev.map(t =>
      t.id === truckId
        ? { ...t, documents: (t.documents || []).filter(d => d.id !== docId) }
        : t
    ));
  }, [trucks]);

  // ── Computed geofence distances ─────────────────────────────────
  const truckDistances = trucks.map(t => {
    const distKm = haversineKm(t.lat, t.lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
    return { id: t.id, distKm, inside: distKm <= GEOFENCE_RADIUS_KM };
  });

  return (
    <TruckContext.Provider value={{
      trucks, alerts, uploads, loading,
      addTruck, removeTruck, editTruck,
      updateStatus, updateLocation,
      truckDistances,
      addDocument, removeDocument,
      addUpload,
    }}>
      {children}
    </TruckContext.Provider>
  );
}

export const useTrucks = () => useContext(TruckContext);
