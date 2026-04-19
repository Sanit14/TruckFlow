import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TruckProvider } from './context/TruckContext';
import LoginPage from './components/Auth/LoginPage';
import Navbar from './components/Common/Navbar';
import AdminDashboard from './components/Admin/AdminDashboard';
import TruckMap from './components/Admin/TruckMap';
import ManagerDashboard from './components/Manager/ManagerDashboard';

// ── Protected layout wrapper ──────────────────────────────────────
function AppShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0d14]">
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}

// ── Route guard ───────────────────────────────────────────────────
function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    // Redirect to correct dashboard
    return <Navigate to={user.role === 'admin' ? '/admin' : '/manager'} replace />;
  }
  return children;
}

// ── App inner (needs AuthContext) ─────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/manager'} replace /> : <LoginPage />}
      />

      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AppShell>
              <AdminDashboard />
            </AppShell>
          </RequireAuth>
        }
      />

      {/* Full-screen live map for admins */}
      <Route
        path="/admin/map"
        element={
          <RequireAuth role="admin">
            <AppShell>
              <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Live Map</h1>
                  <p className="text-slate-400 text-sm mt-0.5">Real-time fleet positions &amp; geofence</p>
                </div>
                <div className="flex-1 glass rounded-2xl p-3 min-h-[480px]">
                  <TruckMap />
                </div>
              </div>
            </AppShell>
          </RequireAuth>
        }
      />

      <Route
        path="/manager"
        element={
          <RequireAuth>
            <AppShell>
              <ManagerDashboard />
            </AppShell>
          </RequireAuth>
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          <Navigate
            to={user ? (user.role === 'admin' ? '/admin' : '/manager') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}

// ── Root export ───────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TruckProvider>
          <AppRoutes />
        </TruckProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
