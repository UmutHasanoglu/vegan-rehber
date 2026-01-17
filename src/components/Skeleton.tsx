import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 animate-pulse">
      <Skeleton className="h-8 w-20 mb-4" />
      <Skeleton className="w-full h-64 rounded-lg mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <div className="mt-6 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
};

export const CategorySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
};

export const SearchResultsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
