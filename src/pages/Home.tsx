import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/products';

const categoryImages = {
  'Snacks': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
  'Beverages': 'https://images.unsplash.com/photo-1544252890-c3e4f8744f34?w=800',
  'Dairy Alternatives': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
  'Ready Meals': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
  'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
  'Condiments': 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800'
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Vegan Rehber</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map(category => (
          <div
            key={category}
            onClick={() => navigate(`/search?category=${encodeURIComponent(category)}`)}
            className="relative overflow-hidden rounded-lg aspect-square cursor-pointer transform transition-transform hover:scale-105"
          >
            <img
              src={categoryImages[category]}
              alt={category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="absolute bottom-3 left-3 text-white font-semibold text-lg">
              {category}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;