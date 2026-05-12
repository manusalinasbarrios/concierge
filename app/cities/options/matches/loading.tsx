import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

      <div className="grid gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 h-44">
            <div className="flex justify-between mb-6">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex justify-center gap-4">
              <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
              <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}