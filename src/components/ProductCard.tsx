import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useProducts();
  const isFavorite = favorites.includes(product.id);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        >
          <Heart 
            size={20} 
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600">{product.brand}</p>
        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          {product.category}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;