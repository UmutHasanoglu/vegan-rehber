import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const SESSION_KEY = 'admin_session';
const ATTEMPTS_KEY = 'admin_attempts';
const LOCKOUT_KEY = 'admin_lockout';

interface AdminContextType {
  isAuthenticated: boolean;
  isLocked: boolean;
  remainingAttempts: number;
  lockoutEndTime: number | null;
  login: (pin: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  isLocked: false,
  remainingAttempts: MAX_ATTEMPTS,
  lockoutEndTime: null,
  login: () => false,
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  // Check session and lockout on mount
  useEffect(() => {
    // Check existing session
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === 'true') {
      setIsAuthenticated(true);
    }

    // Check failed attempts
    const storedAttempts = localStorage.getItem(ATTEMPTS_KEY);
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts, 10));
    }

    // Check lockout
    const storedLockout = localStorage.getItem(LOCKOUT_KEY);
    if (storedLockout) {
      const lockoutEnd = parseInt(storedLockout, 10);
      if (Date.now() < lockoutEnd) {
        setLockoutEndTime(lockoutEnd);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
        setFailedAttempts(0);
      }
    }
  }, []);

  // Clear lockout when it expires
  useEffect(() => {
    if (lockoutEndTime && Date.now() >= lockoutEndTime) {
      setLockoutEndTime(null);
      setFailedAttempts(0);
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(ATTEMPTS_KEY);
    }

    if (lockoutEndTime) {
      const timeout = setTimeout(() => {
        setLockoutEndTime(null);
        setFailedAttempts(0);
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
      }, lockoutEndTime - Date.now());

      return () => clearTimeout(timeout);
    }
  }, [lockoutEndTime]);

  const login = useCallback((pin: string): boolean => {
    // Check if locked out
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      return false;
    }

    if (pin === ADMIN_PIN) {
      // Success - clear attempts and set session
      setIsAuthenticated(true);
      setFailedAttempts(0);
      sessionStorage.setItem(SESSION_KEY, 'true');
      sessionStorage.setItem('adminPin', pin); // Store PIN for API calls
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      return true;
    } else {
      // Failed attempt
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem(ATTEMPTS_KEY, String(newAttempts));

      // Check if should lock out
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(lockoutEnd);
        localStorage.setItem(LOCKOUT_KEY, String(lockoutEnd));
      }

      return false;
    }
  }, [failedAttempts, lockoutEndTime]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('adminPin'); // Clear PIN on logout
  }, []);

  const isLocked = Boolean(lockoutEndTime && Date.now() < lockoutEndTime);
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - failedAttempts);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        isLocked,
        remainingAttempts,
        lockoutEndTime,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
