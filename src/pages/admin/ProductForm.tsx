import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useToast } from '../../components/Toast';
import { useForm } from '../../hooks/useForm';
import { addProductToSheet, updateProductInSheet, isAdminWriteEnabled } from '../../services/googleSheets';
import { categories } from '../../data/products';
import { Product } from '../../types';

interface ProductFormValues {
  name: string;
  brand: string;
  category: string;
  ingredients: string;
  imageUrl: string;
  barcode: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { products, refreshProducts, getProductById } = useProducts();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');

  const canWrite = isAdminWriteEnabled();

  // Get existing product if editing
  const existingProduct = isEditing ? getProductById(id!) : null;

  const validateForm = (values: ProductFormValues) => {
    const errors: Partial<Record<keyof ProductFormValues, string>> = {};

    if (!values.name.trim()) {
      errors.name = t.admin?.nameRequired || 'Name is required';
    }

    if (!values.brand.trim()) {
      errors.brand = t.admin?.brandRequired || 'Brand is required';
    }

    if (!values.category) {
      errors.category = t.admin?.categoryRequired || 'Category is required';
    }

    if (values.imageUrl && !isValidUrl(values.imageUrl)) {
      errors.imageUrl = t.admin?.invalidUrl || 'Invalid URL';
    }

    if (values.barcode && !/^\d{8,13}$/.test(values.barcode)) {
      errors.barcode = t.admin?.invalidBarcode || 'Barcode must be 8-13 digits';
    }

    return errors;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmitForm = async (values: ProductFormValues) => {
    try {
      if (isEditing && existingProduct) {
        const updatedProduct: Product = {
          id: existingProduct.id,
          ...values,
        };
        await updateProductInSheet(updatedProduct);
        showToast(t.admin?.updateSuccess || 'Product updated', 'success');
      } else {
        await addProductToSheet(values);
        showToast(t.admin?.addSuccess || 'Product added', 'success');
      }

      await refreshProducts();
      navigate('/admin');
    } catch (error) {
      console.error('Form submission error:', error);
      showToast(
        t.admin?.saveError || 'Failed to save product',
        'error'
      );
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm<ProductFormValues>({
    initialValues: {
      name: existingProduct?.name || '',
      brand: existingProduct?.brand || '',
      category: existingProduct?.category || '',
      ingredients: existingProduct?.ingredients || '',
      imageUrl: existingProduct?.imageUrl || '',
      barcode: existingProduct?.barcode || '',
    },
    validate: validateForm,
    onSubmit: handleSubmitForm,
  });

  // Update image preview when URL changes
  useEffect(() => {
    if (values.imageUrl && isValidUrl(values.imageUrl)) {
      setImagePreview(values.imageUrl);
    } else {
      setImagePreview('');
    }
  }, [values.imageUrl]);

  // Redirect if not configured for writes
  useEffect(() => {
    if (!canWrite) {
      showToast(t.admin?.writeNotEnabled || 'Write operations not enabled', 'warning');
      navigate('/admin');
    }
  }, [canWrite, navigate, showToast, t.admin?.writeNotEnabled]);

  // Handle case where product not found
  useEffect(() => {
    if (isEditing && !existingProduct && products.length > 0) {
      showToast(t.admin?.productNotFound || 'Product not found', 'error');
      navigate('/admin');
    }
  }, [isEditing, existingProduct, products.length, navigate, showToast, t.admin?.productNotFound]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing
            ? t.admin?.editProduct || 'Edit Product'
            : t.admin?.addProduct || 'Add Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.admin?.productName || 'Product Name'} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name && touched.name
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.admin?.brand || 'Brand'} *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={values.brand}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.brand && touched.brand
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.brand && touched.brand && (
              <p className="mt-1 text-sm text-red-500">{errors.brand}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.admin?.category || 'Category'} *
            </label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.category && touched.category
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            >
              <option value="">{t.admin?.selectCategory || 'Select category'}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && touched.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.admin?.ingredients || 'Ingredients'}
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows={3}
              value={values.ingredients}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isSubmitting}
              placeholder={t.admin?.ingredientsPlaceholder || 'Enter ingredients...'}
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.admin?.imageUrl || 'Image URL'}
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={values.imageUrl}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.imageUrl && touched.imageUrl
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
              placeholder="https://..."
            />
            {errors.imageUrl && touched.imageUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
            )}

            {/* Image Preview */}
            <div className="mt-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  onError={() => setImagePreview('')}
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Barcode */}
          <div>
            <label
              htmlFor="barcode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t.admin?.barcode || 'Barcode'}
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={values.barcode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.barcode && touched.barcode
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-mono`}
              disabled={isSubmitting}
              placeholder="8690511006923"
              maxLength={13}
            />
            {errors.barcode && touched.barcode && (
              <p className="mt-1 text-sm text-red-500">{errors.barcode}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t.admin?.barcodeHelp || 'EAN-8 or EAN-13 barcode (8-13 digits)'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            {t.cancel || 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            {isSubmitting
              ? t.admin?.saving || 'Saving...'
              : t.admin?.save || 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
