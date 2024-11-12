import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';

const Search = () => {
  const { products, loading, favorites } = useProducts();
  const [search, setSearch] = useState('');
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlParams.get('category') || ''
  );
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesFavorites = !showFavorites || favorites.includes(product.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [products, search, selectedCategory, showFavorites, favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Search Products</h1>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`p-2 rounded-full ${
            showFavorites ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Heart size={24} className={showFavorites ? 'fill-red-500' : ''} />
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            !selectedCategory ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {showFavorites && filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No favorite products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;