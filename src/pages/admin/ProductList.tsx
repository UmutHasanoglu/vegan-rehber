import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Trash2, Plus, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useToast } from '../../components/Toast';
import { deleteProductFromSheet, isAdminWriteEnabled } from '../../services/googleSheets';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { Product } from '../../types';

type SortField = 'id' | 'name' | 'brand' | 'category';
type SortDirection = 'asc' | 'desc';

const ProductList: React.FC = () => {
  const { products, loading, refreshProducts } = useProducts();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canWrite = isAdminWriteEnabled();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase()) ||
        product.id.includes(search);
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = parseInt(a.id) - parseInt(b.id);
      } else {
        comparison = a[sortField].localeCompare(b[sortField], 'tr');
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, search, categoryFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    setIsDeleting(true);
    try {
      await deleteProductFromSheet(deleteProduct.id);
      await refreshProducts();
      showToast(t.admin?.deleteSuccess || 'Product deleted', 'success');
      setDeleteProduct(null);
    } catch (error) {
      showToast(
        t.admin?.deleteError || 'Failed to delete product',
        'error'
      );
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.admin?.products || 'Products'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} {t.admin?.of || 'of'} {products.length} {t.admin?.productsShown || 'products'}
          </p>
        </div>

        {canWrite && (
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
            {t.admin?.addProduct || 'Add Product'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t.admin?.searchProducts || 'Search products...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">{t.all || 'All Categories'}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center gap-1">
                    ID
                    <SortIcon field="id" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.admin?.image || 'Image'}
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center gap-1">
                    {t.admin?.name || 'Name'}
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('brand')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center gap-1">
                    {t.admin?.brand || 'Brand'}
                    <SortIcon field="brand" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center gap-1">
                    {t.admin?.category || 'Category'}
                    <SortIcon field="category" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.admin?.barcode || 'Barcode'}
                </th>
                {canWrite && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.admin?.actions || 'Actions'}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map(product => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {product.id}
                  </td>
                  <td className="px-4 py-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">N/A</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </span>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-gray-400 hover:text-green-500"
                        title="View in app"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {product.brand}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {product.barcode || '-'}
                  </td>
                  {canWrite && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title={t.admin?.edit || 'Edit'}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteProduct(product)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title={t.admin?.delete || 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={canWrite ? 7 : 6}
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t.admin?.noProducts || 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteProduct}
        productName={deleteProduct?.name || ''}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteProduct(null)}
      />
    </div>
  );
};

export default ProductList;
