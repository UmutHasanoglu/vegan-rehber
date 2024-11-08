import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Scan, ClipboardList } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around py-3">
          <button
            onClick={() => navigate('/')}
            className={`p-2 rounded-full ${
              location.pathname === '/' ? 'text-green-600 bg-green-50' : 'text-gray-600'
            }`}
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => navigate('/scanner')}
            className={`p-2 rounded-full ${
              location.pathname === '/scanner' ? 'text-green-600 bg-green-50' : 'text-gray-600'
            }`}
          >
            <Scan size={24} />
          </button>
          <button
            onClick={() => navigate('/report')}
            className={`p-2 rounded-full ${
              location.pathname === '/report' ? 'text-green-600 bg-green-50' : 'text-gray-600'
            }`}
          >
            <ClipboardList size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;