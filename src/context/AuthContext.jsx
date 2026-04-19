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

  // Step 1: send OTP (mock – just validates phone format)
  const sendOTP = useCallback((phone) => {
    // Accept any 10-digit Indian phone number
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) return { ok: false, error: 'Enter a valid 10-digit phone number.' };
    return { ok: true, otp: DEMO_OTP }; // returned so UI can show it
  }, []);

  // Step 2: verify OTP and log in
  const verifyOTP = useCallback((phone, otp) => {
    if (otp !== DEMO_OTP) return { ok: false, error: 'Incorrect OTP. Try again.' };

    const clean = phone.replace(/\D/g, '').slice(-10);
    const found = DEMO_USERS.find((u) => u.phone === clean);
    const loggedIn = found ?? { id: 'u_guest', phone: clean, role: 'manager', name: 'Manager User' };

    setUser(loggedIn);
    localStorage.setItem('tf_user', JSON.stringify(loggedIn));
    return { ok: true, user: loggedIn };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('tf_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
