import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { loadProducts } from '../data/products';

const PRODUCTS_CACHE_KEY = 'products_cache';
const PRODUCTS_CACHE_TIMESTAMP_KEY = 'products_cache_timestamp';
const FAVORITES_KEY = 'favorites';
const RECENTLY_VIEWED_KEY = 'recently_viewed';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RECENTLY_VIEWED = 10;

interface ProductContextType {
  products: Product[];
  favorites: string[];
  recentlyViewed: string[];
  toggleFavorite: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
  loading: boolean;
  error: string | null;
  barcodeIndex: Map<string, Product>;
  getProductByBarcode: (barcode: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  favorites: [],
  recentlyViewed: [],
  toggleFavorite: () => {},
  addToRecentlyViewed: () => {},
  loading: true,
  error: null,
  barcodeIndex: new Map(),
  getProductByBarcode: () => undefined,
  getProductById: () => undefined,
  refreshProducts: async () => {},
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create barcode index for O(1) lookup
  const barcodeIndex = useMemo(() => {
    const index = new Map<string, Product>();
    products.forEach(product => {
      if (product.barcode) {
        index.set(product.barcode, product);
      }
    });
    return index;
  }, [products]);

  // Create product ID index for O(1) lookup
  const productIndex = useMemo(() => {
    const index = new Map<string, Product>();
    products.forEach(product => {
      index.set(product.id, product);
    });
    return index;
  }, [products]);

  const getProductByBarcode = useCallback(
    (barcode: string) => barcodeIndex.get(barcode),
    [barcodeIndex]
  );

  const getProductById = useCallback(
    (id: string) => productIndex.get(id),
    [productIndex]
  );

  // Load products with caching
  const loadProductsWithCache = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(PRODUCTS_CACHE_TIMESTAMP_KEY);

        if (cachedProducts && cacheTimestamp) {
          const timestamp = parseInt(cacheTimestamp, 10);
          const isValid = Date.now() - timestamp < CACHE_DURATION;

          if (isValid) {
            const parsed = JSON.parse(cachedProducts);
            setProducts(parsed);
            setLoading(false);
            return;
          }
        }
      }

      // Load fresh data
      const data = await loadProducts();
      setProducts(data);

      // Cache the data
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(PRODUCTS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Ürünler yüklenemedi. Lütfen tekrar deneyin.');

      // Try to use cached data as fallback
      const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);
      if (cachedProducts) {
        try {
          setProducts(JSON.parse(cachedProducts));
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    await loadProductsWithCache(true);
  }, [loadProductsWithCache]);

  useEffect(() => {
    loadProductsWithCache();

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        // Ignore parse errors
      }
    }

    // Load recently viewed from localStorage
    const storedRecentlyViewed = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (storedRecentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(storedRecentlyViewed));
      } catch {
        // Ignore parse errors
      }
    }
  }, [loadProductsWithCache]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const addToRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists, then add to front
      const filtered = prev.filter(viewedId => viewedId !== id);
      const newRecentlyViewed = [id, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newRecentlyViewed));
      return newRecentlyViewed;
    });
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        favorites,
        recentlyViewed,
        toggleFavorite,
        addToRecentlyViewed,
        loading,
        error,
        barcodeIndex,
        getProductByBarcode,
        getProductById,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
