import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, favorites, toggleFavorite } = useProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-green-600 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-green-600 flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart
            size={24}
            className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-lg text-gray-600 mt-1">{product.brand}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
          {product.category}
        </span>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
        </div>

        {product.barcode && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Barcode</h2>
            <p className="text-gray-700">{product.barcode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;