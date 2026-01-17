import React, { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Heart, SortAsc, ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { useTranslation } from '../i18n/LanguageContext';
import { SearchResultsSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { Product } from '../types';

type SortOption = 'nameAsc' | 'nameDesc' | 'brandAsc' | 'brandDesc';

const ITEMS_PER_PAGE = 12;

const Search: React.FC = () => {
  const { products, loading, favorites } = useProducts();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlParams.get('category') || ''
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('nameAsc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(1);

  const sortProducts = useCallback((products: Product[], sortOption: SortOption): Product[] => {
    const sorted = [...products];
    switch (sortOption) {
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
      case 'brandAsc':
        return sorted.sort((a, b) => a.brand.localeCompare(b.brand, 'tr'));
      case 'brandDesc':
        return sorted.sort((a, b) => b.brand.localeCompare(a.brand, 'tr'));
      default:
        return sorted;
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesFavorites = !showFavorites || favorites.includes(product.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
    return sortProducts(filtered, sortBy);
  }, [products, search, selectedCategory, showFavorites, favorites, sortBy, sortProducts]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Reset page when filters change
  const handleFilterChange = useCallback((newCategory: string) => {
    setSelectedCategory(newCategory);
    setPage(1);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortMenu(false);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse" />
        <SearchResultsSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
          {t.searchPage.title}
        </h1>
        <div className="flex gap-2">
          {/* Sort Button */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={t.searchPage.sortBy}
              aria-expanded={showSortMenu}
              aria-haspopup="listbox"
            >
              <SortAsc size={20} />
              <ChevronDown size={16} />
            </button>
            {showSortMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                role="listbox"
              >
                {(['nameAsc', 'nameDesc', 'brandAsc', 'brandDesc'] as SortOption[]).map(option => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      sortBy === option
                        ? 'text-green-600 dark:text-green-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    role="option"
                    aria-selected={sortBy === option}
                  >
                    {t.searchPage.sortOptions[option]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => {
              setShowFavorites(!showFavorites);
              setPage(1);
            }}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
              showFavorites
                ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
            aria-label={t.searchPage.showFavorites}
            aria-pressed={showFavorites}
          >
            <Heart size={24} className={showFavorites ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder={t.searchPage.placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label={t.searchPage.placeholder}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
        role="tablist"
        aria-label="Kategori filtresi"
      >
        <button
          onClick={() => handleFilterChange('')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
            !selectedCategory
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          role="tab"
          aria-selected={!selectedCategory}
        >
          {t.all}
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
              selectedCategory === category
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            role="tab"
            aria-selected={selectedCategory === category}
          >
            {t.categories[category as keyof typeof t.categories]}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {filteredProducts.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'ürün' : 'ürün'} bulundu
        </p>
      )}

      {/* Product Grid or Empty State */}
      {showFavorites && filteredProducts.length === 0 ? (
        <EmptyState
          type="favorites"
          title={t.searchPage.noFavorites}
          description={t.searchPage.noFavoritesDescription}
        />
      ) : !showFavorites && filteredProducts.length === 0 ? (
        <EmptyState
          type="search"
          title={t.searchPage.noResults}
          description={t.searchPage.noResultsDescription}
          action={
            search || selectedCategory ? (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Filtreleri Temizle
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Daha Fazla Göster ({filteredProducts.length - paginatedProducts.length} kaldı)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
