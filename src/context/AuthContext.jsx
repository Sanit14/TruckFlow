import { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_USERS, DEMO_OTP } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tf_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // ── Step 1: Validate phone number ─────────────────────────
  const sendOTP = useCallback(async (phone) => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      return { ok: false, error: 'Enter a valid 10-digit phone number.' };
    }

    setLoading(true);
    try {
      // Simulate API latency
      await new Promise((res) => setTimeout(res, 300));

      const match = DEMO_USERS.find((u) => u.phone === clean);
      if (!match) {
        // Also allow generic login for demo purposes
        return { ok: true, isDemoFallback: true };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Authentication error. Please try again.' };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Step 2: Verify PIN / OTP ────────────────────────────────
  const verifyOTP = useCallback(async (phone, pin) => {
    const clean = phone.replace(/\D/g, '').slice(-10);

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 300));

      const match = DEMO_USERS.find((u) => u.phone === clean);
      let loggedInUser = null;

      if (match) {
        if (match.pin && match.pin !== pin && pin !== DEMO_OTP) {
          return { ok: false, error: 'Incorrect PIN. Try again.' };
        }
        loggedInUser = {
          id: match.id,
          phone: match.phone,
          name: match.name,
        };
      } else {
        // Fallback user creation for any valid 10-digit phone
        loggedInUser = {
          id: `u-${Date.now()}`,
          phone: clean,
          name: `User (${clean.slice(-4)})`,
        };
      }

      setUser(loggedInUser);
      localStorage.setItem('tf_user', JSON.stringify(loggedInUser));
      return { ok: true, user: loggedInUser };
    } catch {
      return { ok: false, error: 'Authentication error. Please try again.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('tf_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

