import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 animate-pulse">
      <div className="h-4 w-32 bg-gray-700 rounded mb-6" />
      <div className="h-8 w-48 bg-gray-700 rounded mb-6" />

      <div className="grid gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-700 rounded-xl bg-gray-800/30 flex flex-col h-[500px]">
            <div className="h-8 w-1/2 bg-gray-700 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-700 rounded" />
            </div>
            <div className="h-12 w-full bg-gray-700 rounded mt-4" />
          </div>
        ))}
      </div>
    </main>
  );
}