import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TruckProvider } from './context/TruckContext';
import { ToastProvider } from './components/Common/Toast';
import MeshBackground from './components/Common/MeshBackground';
import LoginPage from './components/Auth/LoginPage';
import Navbar from './components/Common/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import TruckMap from './components/Dashboard/TruckMap';
import LandingPage from './components/Landing/LandingPage';
import TrialDemoPage from './components/Landing/TrialDemoPage';
import SignupPage from './components/Landing/SignupPage';
import PageWipe from './components/Common/PageWipe';

// ── Protected layout wrapper ──────────────────────────────────────
function AppShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0d14] relative">
      <MeshBackground />
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col relative z-10">
        {children}
      </main>
    </div>
  );
}

// ── Route guard ───────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ── App inner (needs AuthContext) ─────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/trial" element={<TrialDemoPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <AppShell>
              <Dashboard />
            </AppShell>
          </RequireAuth>
        }
      />

      {/* Full-screen live map */}
      <Route
        path="/dashboard/map"
        element={
          <RequireAuth>
            <AppShell>
              <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Live Map</h1>
                  <p className="text-slate-400 text-sm mt-0.5">Real-time fleet positions &amp; geofence</p>
                </div>
                <div className="flex-1 glass rounded-2xl p-3 min-h-[480px]">
                  <TruckMap showRadiusControl />
                </div>
              </div>
            </AppShell>
          </RequireAuth>
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

// ── Root export ───────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PageWipe />
      <AuthProvider>
        <TruckProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </TruckProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
