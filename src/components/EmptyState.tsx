import React, { ReactNode } from 'react';
import { SearchX, Heart, Package, AlertCircle } from 'lucide-react';

type EmptyStateType = 'search' | 'favorites' | 'products' | 'error';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const defaultContent: Record<EmptyStateType, { icon: ReactNode; title: string; description: string }> = {
  search: {
    icon: <SearchX size={48} className="text-gray-400 dark:text-gray-500" />,
    title: 'Sonuç bulunamadı',
    description: 'Arama kriterlerinize uygun ürün bulunamadı. Farklı bir arama deneyin.',
  },
  favorites: {
    icon: <Heart size={48} className="text-gray-400 dark:text-gray-500" />,
    title: 'Favori ürününüz yok',
    description: 'Beğendiğiniz ürünleri favorilere ekleyin.',
  },
  products: {
    icon: <Package size={48} className="text-gray-400 dark:text-gray-500" />,
    title: 'Ürün bulunamadı',
    description: 'Bu kategoride henüz ürün bulunmuyor.',
  },
  error: {
    icon: <AlertCircle size={48} className="text-red-400" />,
    title: 'Bir hata oluştu',
    description: 'Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'search',
  title,
  description,
  icon,
  action,
}) => {
  const content = defaultContent[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">{icon || content.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title || content.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        {description || content.description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
