import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Scan, ClipboardList } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  labelKey: 'home' | 'search' | 'scanner' | 'report';
}

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { path: '/', icon: <Home size={24} />, labelKey: 'home' },
    { path: '/search', icon: <Search size={24} />, labelKey: 'search' },
    { path: '/scanner', icon: <Scan size={24} />, labelKey: 'scanner' },
    { path: '/report', icon: <ClipboardList size={24} />, labelKey: 'report' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors"
      role="navigation"
      aria-label="Ana navigasyon"
    >
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onKeyDown={e => handleKeyDown(e, item.path)}
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  isActive
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={t.nav[item.labelKey]}
                aria-current={isActive ? 'page' : undefined}
                role="link"
                tabIndex={0}
              >
                {item.icon}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
