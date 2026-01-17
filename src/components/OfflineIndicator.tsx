import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-yellow-900'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Tekrar bağlandınız</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>Çevrimdışısınız - Bazı özellikler kısıtlı olabilir</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
