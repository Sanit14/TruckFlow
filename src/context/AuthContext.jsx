import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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

  // ── Step 1: Validate phone is whitelisted ─────────────────────────
  const sendOTP = useCallback(async (phone) => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      return { ok: false, error: 'Enter a valid 10-digit phone number.' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('allowed_users')
        .select('id')
        .eq('phone', clean)
        .single();

      if (error || !data) {
        return { ok: false, error: '🚫 Access denied. This number is not registered.' };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Connection error. Please try again.' };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Step 2: Verify PIN against DB ────────────────────────────────
  const verifyOTP = useCallback(async (phone, pin) => {
    const clean = phone.replace(/\D/g, '').slice(-10);

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('allowed_users')
        .select('id, name, role, phone, pin')
        .eq('phone', clean)
        .single();

      if (error || !data) {
        return { ok: false, error: 'User not found. Contact your administrator.' };
      }

      if (data.pin !== pin) {
        return { ok: false, error: 'Incorrect PIN. Try again.' };
      }

      const loggedIn = {
        id:    data.id,
        phone: data.phone,
        name:  data.name,
        role:  data.role,
      };

      setUser(loggedIn);
      localStorage.setItem('tf_user', JSON.stringify(loggedIn));
      return { ok: true, user: loggedIn };
    } catch {
      return { ok: false, error: 'Connection error. Please try again.' };
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
