// ── Office location ───────────────────────────────────────────────
// Change lat/lng to your actual office location.
export const OFFICE_LOCATION = { lat: 28.6139, lng: 77.2090, name: 'Main Office – Delhi' };
export const GEOFENCE_RADIUS_KM = 5;

// ── Demo accounts ─────────────────────────────────────────────────
// TO CHANGE PHONE NUMBERS: edit the `phone` values below (10-digit, no country code).
// Role must be 'admin' or 'manager'.
export const DEMO_USERS = [
  { id: 'u1', phone: '9876543210', role: 'admin', name: 'Admin User' },
  { id: 'u2', phone: '9123456789', role: 'manager', name: 'Manager User' },
];

// ── Quick reference: Indian city coordinates ───────────────────────
// Use these when manually setting truck locations:
// Delhi      : 28.6139, 77.2090
// Mumbai     : 19.0760, 72.8777
// Bangalore  : 12.9716, 77.5946
// Chennai    : 13.0827, 80.2707
// Hyderabad  : 17.3850, 78.4867
// Kolkata    : 22.5726, 88.3639
// Pune       : 18.5204, 73.8567
// Ahmedabad  : 23.0225, 72.5714

// ── Default OTP (mock) ────────────────────────────────────────────
export const DEMO_OTP = '123456';

// ── Truck list ────────────────────────────────────────────────────
export const INITIAL_TRUCKS = [
  {
    id: 'tk1',
    name: 'TRK-001',
    plateNumber: 'DL 01 AB 1234',
    model: 'Tata Prima 4928.S',
    year: 2021,
    ownerName: 'Singh Logistics Pvt. Ltd.',
    driver: 'Rajesh Kumar',
    driverPhone: '9876543210',
    insuranceExpiry: '2025-06-15',
    status: 'Idle',
    lat: 28.6200,
    lng: 77.2150,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'tk2',
    name: 'TRK-002',
    plateNumber: 'DL 02 CD 5678',
    model: 'Ashok Leyland 3518',
    year: 2020,
    ownerName: 'Patel Transport Co.',
    driver: 'Suresh Patel',
    driverPhone: '9123456789',
    insuranceExpiry: '2025-12-31',
    status: 'Loading',
    lat: 28.5960,
    lng: 77.1840,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'tk3',
    name: 'TRK-003',
    plateNumber: 'DL 03 EF 9012',
    model: 'Eicher Pro 6055',
    year: 2022,
    ownerName: 'Singh Logistics Pvt. Ltd.',
    driver: 'Mahesh Singh',
    driverPhone: '',
    insuranceExpiry: '2025-05-02',
    status: 'Outgoing',
    lat: 28.6420,
    lng: 77.2340,
    lastUpdated: new Date().toISOString(),
  },
];

export const TRUCK_STATUSES = ['Idle', 'Loading', 'Unloading', 'Incoming', 'Outgoing'];

/** Returns Tailwind class key for a status */
export const statusKey = (status) => status?.toLowerCase() ?? 'idle';

/** Haversine distance in km */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Format ISO timestamp to readable string */
export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
