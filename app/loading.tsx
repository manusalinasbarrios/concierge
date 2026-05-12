import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 animate-pulse">
      <section className="text-center mb-16 py-8 border-b border-foreground/5">
        <div className="h-10 w-3/4 md:w-1/2 bg-gray-300 rounded mx-auto mb-4" />
        <div className="h-6 w-full md:w-2/3 bg-gray-200 rounded mx-auto" />
      </section>

      <div className="flex justify-center py-12">
        <div className="h-14 w-48 bg-gray-300 rounded-full" />
      </div>
    </main>
  );
}