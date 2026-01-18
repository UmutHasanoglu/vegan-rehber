import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Package, Plus, LogOut, Home, RefreshCw } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useProducts } from '../../context/ProductContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useToast } from '../../components/Toast';
import ThemeToggle from '../../components/ThemeToggle';

const AdminLayout: React.FC = () => {
  const { logout } = useAdmin();
  const { refreshProducts } = useProducts();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleLogout = () => {
    logout();
    showToast(t.admin?.logoutSuccess || 'Logged out', 'info');
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
      showToast(t.admin?.refreshSuccess || 'Data refreshed', 'success');
    } catch {
      showToast(t.admin?.refreshError || 'Failed to refresh', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
                {t.admin?.title || 'Admin Panel'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                title={t.admin?.refreshData || 'Refresh data'}
              >
                <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              <ThemeToggle />
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={t.admin?.backToApp || 'Back to app'}
              >
                <Home size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">{t.admin?.logout || 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Package size={18} />
              <span>{t.admin?.products || 'Products'}</span>
            </NavLink>
            <NavLink
              to="/admin/products/new"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Plus size={18} />
              <span>{t.admin?.addProduct || 'Add Product'}</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
