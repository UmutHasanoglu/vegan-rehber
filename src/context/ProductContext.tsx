import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { loadProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  favorites: [],
  toggleFavorite: () => {},
  loading: true,
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <ProductContext.Provider value={{ products, favorites, toggleFavorite, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);