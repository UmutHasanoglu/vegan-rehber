import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { useTranslation } from '../i18n/LanguageContext';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LazyImage from '../components/LazyImage';
import { CategorySkeleton } from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import { Clock } from 'lucide-react';

const categoryImages: Record<string, string> = {
  'Atıştırmalık': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
  'Çikolata': 'https://images.unsplash.com/photo-1604514813560-1e4f5726db65?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Temizlik': 'https://images.unsplash.com/photo-1583947582387-6f2336412460?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Kahvaltılık': 'https://images.unsplash.com/photo-1504708706948-13d6cbba4062?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Konserve': 'https://images.unsplash.com/photo-1617937382785-36e98f2eed16?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Sos': 'https://images.unsplash.com/photo-1688912739719-ff16a3e5a49a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Dondurulmuş Gıda': 'https://images.unsplash.com/photo-1474480109237-15a7ca8f0685?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Şarküteri': 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading, recentlyViewed, getProductById } = useProducts();

  const recentProducts = recentlyViewed
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .slice(0, 4);

  const handleCategoryKeyDown = (e: React.KeyboardEvent, category: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/search?category=${encodeURIComponent(category)}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>
        <CategorySkeleton />
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t.appName}
        </h1>
        <div className="flex gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Recently Viewed Section */}
      {recentProducts.length > 0 && (
        <section className="mb-8" aria-labelledby="recently-viewed-title">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-gray-600 dark:text-gray-400" />
            <h2
              id="recently-viewed-title"
              className="text-lg font-semibold text-gray-800 dark:text-gray-200"
            >
              {t.product.recentlyViewed}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section aria-labelledby="categories-title">
        <h2
          id="categories-title"
          className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          {t.home.categories}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <div
              key={category}
              onClick={() => navigate(`/search?category=${encodeURIComponent(category)}`)}
              onKeyDown={e => handleCategoryKeyDown(e, category)}
              className="relative overflow-hidden rounded-lg aspect-square cursor-pointer transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              tabIndex={0}
              role="link"
              aria-label={`${t.categories[category as keyof typeof t.categories]} kategorisine git`}
            >
              <LazyImage
                src={categoryImages[category]}
                alt={t.categories[category as keyof typeof t.categories]}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-3 left-3 text-white font-semibold text-lg">
                {t.categories[category as keyof typeof t.categories]}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
