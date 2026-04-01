import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-4 space-y-4 animate-pulse border border-gray-100 dark:border-gray-800">
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
