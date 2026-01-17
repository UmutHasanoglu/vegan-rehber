import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Bir şeyler yanlış gitti
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                  Hata detayları
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto text-red-600 dark:text-red-400">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <RefreshCw size={18} />
                Tekrar Dene
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Home size={18} />
                Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
