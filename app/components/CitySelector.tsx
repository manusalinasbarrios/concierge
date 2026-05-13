'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface City {
  id: number;
  name: string;
}

export default function CitySelector({ cities = [], lang }: { cities: City[], lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hide on the main page where the full city list is already shown
  if (pathname === '/' || pathname === '/cities') return null;

  const cityName = searchParams.get('cityName');
  const activeLang = searchParams.get('lang') || lang || 'en';

  return (
    <div className="fixed top-0 z-[60] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-foreground/10 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center gap-4 px-6 h-16">
        <button 
          onClick={() => router.push(`/?lang=${activeLang}`)}
          className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors group"
          aria-label="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house group-hover:scale-110 transition-transform">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </button>

        {cityName && (
          <h1 className="text-xl font-bold uppercase tracking-tight text-foreground truncate">
            {cityName}
          </h1>
        )}
      </div>
    </div>
  );
}