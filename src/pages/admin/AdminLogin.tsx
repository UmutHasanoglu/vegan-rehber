import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useToast } from '../../components/Toast';

const AdminLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLocked, remainingAttempts, lockoutEndTime } = useAdmin();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Countdown for lockout
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (lockoutEndTime) {
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
        setCountdown(remaining);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutEndTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      return;
    }

    if (pin.length < 4) {
      setError(t.admin?.pinTooShort || 'PIN must be at least 4 characters');
      return;
    }

    const success = login(pin);

    if (success) {
      showToast(t.admin?.loginSuccess || 'Successfully logged in', 'success');
      navigate(from, { replace: true });
    } else {
      setError(t.admin?.wrongPin || 'Wrong PIN');
      setPin('');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <Lock className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.admin?.title || 'Admin Panel'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t.admin?.enterPin || 'Enter your PIN to continue'}
          </p>
        </div>

        {isLocked ? (
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <Clock className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {t.admin?.accountLocked || 'Account Locked'}
            </h2>
            <p className="text-red-600 dark:text-red-300">
              {t.admin?.tryAgainIn || 'Try again in'} {formatTime(countdown)}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
                autoComplete="off"
                maxLength={10}
              />
            </div>

            {remainingAttempts < 5 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
                {t.admin?.attemptsRemaining || 'Attempts remaining'}: {remainingAttempts}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors font-medium"
            >
              {t.admin?.login || 'Login'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            ← {t.back || 'Back to app'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
