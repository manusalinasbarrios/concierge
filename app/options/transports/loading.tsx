import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 animate-pulse">
      <div className="h-4 w-32 bg-gray-700 rounded mb-6" />
      <div className="h-8 w-48 bg-gray-700 rounded mb-6" />

      <div className="grid gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border border-gray-700 rounded-lg bg-gray-800/30 flex items-center justify-between">
            <div className="flex items-center gap-4 w-full">
              <div className="w-8 h-8 rounded bg-gray-700 flex-shrink-0" />
              <div className="h-6 w-1/2 bg-gray-700 rounded" />
            </div>
            <div className="h-10 w-24 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}