import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useTranslation } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';
import LazyImage from '../components/LazyImage';
import { ProductDetailSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { products, favorites, toggleFavorite, addToRecentlyViewed, loading, getProductById } = useProducts();
  const [canShare, setCanShare] = useState(false);

  const product = getProductById(id || '') || products.find(p => p.id === id);
  const isFavorite = id ? favorites.includes(id) : false;

  // Add to recently viewed when product is loaded
  useEffect(() => {
    if (id && product) {
      addToRecentlyViewed(id);
    }
  }, [id, product, addToRecentlyViewed]);

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: `${product.name} - ${product.brand}`,
      text: `${product.name} by ${product.brand} - Vegan Rehber'de bul!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Paylaşıldı!', 'success');
      }
    } catch (err) {
      // User cancelled or error
      if ((err as Error).name !== 'AbortError') {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Link kopyalandı!', 'success');
        } catch {
          showToast('Paylaşım başarısız', 'error');
        }
      }
    }
  };

  const handleFavoriteToggle = () => {
    if (!id) return;
    toggleFavorite(id);
    showToast(
      isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi',
      isFavorite ? 'info' : 'success'
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleBackKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBack();
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="p-4">
        <EmptyState
          type="error"
          title={t.product.notFound}
          description="Bu ürün veritabanımızda bulunamadı."
          action={
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <ArrowLeft size={18} />
              {t.back}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <article className="p-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        onKeyDown={handleBackKeyDown}
        className="mb-4 text-green-600 dark:text-green-400 flex items-center gap-2 hover:text-green-700 dark:hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1"
        aria-label={t.back}
      >
        <ArrowLeft size={20} />
        <span>{t.back}</span>
      </button>

      {/* Product Image */}
      <div className="relative">
        <LazyImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 rounded-lg"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Share Button */}
          {canShare && (
            <button
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={handleShare}
              aria-label={t.product.share}
            >
              <Share2 size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {/* Favorite Button */}
          <button
            className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleFavoriteToggle}
            aria-label={isFavorite ? t.product.removeFromFavorites : t.product.addToFavorites}
            aria-pressed={isFavorite}
          >
            <Heart
              size={24}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}
            />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{product.brand}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
          {t.categories[product.category as keyof typeof t.categories] || product.category}
        </span>

        {/* Ingredients Section */}
        <section className="mt-6" aria-labelledby="ingredients-heading">
          <h2
            id="ingredients-heading"
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
          >
            {t.product.ingredients}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.ingredients}</p>
        </section>

        {/* Barcode Section */}
        {product.barcode && (
          <section className="mt-6" aria-labelledby="barcode-heading">
            <h2
              id="barcode-heading"
              className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              {t.product.barcode}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-mono">{product.barcode}</p>
          </section>
        )}
      </div>
    </article>
  );
};

export default ProductDetail;
