import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import LazyImage from './LazyImage';
import { useTranslation } from '../i18n/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useProducts();
  const { t } = useTranslation();
  const isFavorite = favorites.includes(product.id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/product/${product.id}`);
    }
  };

  const handleFavoriteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(product.id);
    }
  };

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] focus-within:ring-2 focus-within:ring-green-500"
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`${product.name} - ${product.brand}`}
    >
      <div className="relative">
        <LazyImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48"
        />
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          onKeyDown={handleFavoriteKeyDown}
          aria-label={isFavorite ? t.product.removeFromFavorites : t.product.addToFavorites}
          aria-pressed={isFavorite}
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400">{product.brand}</p>
        <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm rounded-full">
          {product.category}
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
