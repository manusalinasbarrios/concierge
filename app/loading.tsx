import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 animate-pulse">
      <div className="h-10 w-64 bg-gray-700 rounded mb-8" />
      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 w-full border border-gray-700 rounded-lg bg-gray-800/30">
            <div className="p-4 space-y-4">
              <div className="h-6 w-1/3 bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}