import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import { CategorySkeleton, SearchResultsSkeleton, ProductDetailSkeleton } from './components/Skeleton';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Scanner = lazy(() => import('./pages/Scanner'));
const Report = lazy(() => import('./pages/Report'));

// Loading fallbacks for each route
const HomeLoading = () => (
  <div className="p-4">
    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
    <CategorySkeleton />
  </div>
);

const SearchLoading = () => (
  <div className="p-4">
    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse" />
    <SearchResultsSkeleton count={4} />
  </div>
);

const DetailLoading = () => <ProductDetailSkeleton />;

const ScannerLoading = () => (
  <div className="p-4">
    <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
  </div>
);

const ReportLoading = () => (
  <div className="p-4 space-y-4">
    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    <div className="flex gap-2">
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    </div>
    <div className="space-y-4">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <ProductProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-green-50 dark:bg-gray-900 transition-colors">
                  <OfflineIndicator />
                  <div className="max-w-lg mx-auto pb-20">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Suspense fallback={<HomeLoading />}>
                            <Home />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/search"
                        element={
                          <Suspense fallback={<SearchLoading />}>
                            <Search />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/product/:id"
                        element={
                          <Suspense fallback={<DetailLoading />}>
                            <ProductDetail />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/scanner"
                        element={
                          <Suspense fallback={<ScannerLoading />}>
                            <Scanner />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/report"
                        element={
                          <Suspense fallback={<ReportLoading />}>
                            <Report />
                          </Suspense>
                        }
                      />
                    </Routes>
                    <Navigation />
                  </div>
                </div>
              </BrowserRouter>
            </ProductProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
