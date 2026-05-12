import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 animate-pulse">
      <div className="h-4 w-32 bg-gray-700 rounded mb-6" />
      <div className="h-8 w-48 bg-gray-700 rounded mb-6" />

      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 border border-gray-700 rounded-lg bg-gray-800/30 h-40">
            <div className="h-8 w-1/2 bg-gray-700 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}