import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useTranslation } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';
import { AlertCircle, RefreshCw, Camera } from 'lucide-react';

const Scanner: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const navigate = useNavigate();
  const { getProductByBarcode, loading } = useProducts();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleSuccess = useCallback(
    (result: string) => {
      // Use O(1) barcode lookup instead of O(n) find
      const product = getProductByBarcode(result);
      if (product) {
        showToast(`${product.name} bulundu!`, 'success');
        navigate(`/product/${product.id}`);
      } else {
        setError(t.scanner.notFound);
        showToast(t.scanner.notFound, 'warning');
      }
    },
    [getProductByBarcode, navigate, showToast, t.scanner.notFound]
  );

  const handleError = useCallback((err: string) => {
    // Only log actual errors, not "No QR code found"
    if (!err.includes('No QR code found') && !err.includes('No barcode or QR code detected')) {
      console.warn('Scanner error:', err);
    }
  }, []);

  const initScanner = useCallback(() => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
          scannerRef.current.clear();
        }
      } catch {
        // Ignore errors during cleanup
      }
    }

    setError('');
    setPermissionDenied(false);

    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        scanner.clear();
        handleSuccess(decodedText);
      },
      (errorMessage) => {
        handleError(errorMessage);
        // Check for permission denied
        if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied')) {
          setPermissionDenied(true);
        }
      }
    );

    setIsInitialized(true);
  }, [handleSuccess, handleError]);

  useEffect(() => {
    if (!loading) {
      initScanner();
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [loading, initScanner]);

  const handleRetry = () => {
    setError('');
    setPermissionDenied(false);
    initScanner();
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6">
        {t.scanner.title}
      </h1>

      {/* Permission Denied State */}
      {permissionDenied && (
        <div className="mb-6 p-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
          <Camera size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            {t.scanner.permissionDenied}
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            Barkod taramak için kamera erişimine izin vermeniz gerekiyor.
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <RefreshCw size={18} />
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Error State */}
      {error && !permissionDenied && (
        <div
          className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3"
          role="alert"
        >
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Tekrar tara
            </button>
          </div>
        </div>
      )}

      {/* Scanner Container */}
      <div
        id="reader"
        className={`w-full rounded-lg overflow-hidden ${!isInitialized ? 'hidden' : ''}`}
        aria-label="Barkod tarayıcı"
      />

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Nasıl Kullanılır
        </h2>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>Ürünün barkodunu kamera önüne tutun</li>
          <li>Barkodun çerçeve içinde olduğundan emin olun</li>
          <li>Otomatik olarak tanınacak ve yönlendirileceksiniz</li>
        </ul>
      </div>
    </div>
  );
};

export default Scanner;
