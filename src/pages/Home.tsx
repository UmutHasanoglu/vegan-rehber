import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/products';

const categoryImages = {
  'Atıştırmalık': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
  'Çikolata': 'https://images.unsplash.com/photo-1604514813560-1e4f5726db65?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Temizlik': 'https://images.unsplash.com/photo-1583947582387-6f2336412460?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Kahvaltılık': 'https://images.unsplash.com/photo-1504708706948-13d6cbba4062?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Konserve': 'https://images.unsplash.com/photo-1617937382785-36e98f2eed16?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Sos': 'https://images.unsplash.com/photo-1688912739719-ff16a3e5a49a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Dondurulmuş Gıda': 'https://images.unsplash.com/photo-1474480109237-15a7ca8f0685?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Şarküteri': 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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