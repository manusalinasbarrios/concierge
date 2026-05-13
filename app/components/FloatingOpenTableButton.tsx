'use client'

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function FloatingOpenTableButton({ lang }: { lang: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cityId = searchParams.get('city');

  // Show on /cities/options and sub-routes only when a city is selected
  const isVisible = pathname?.startsWith('/cities/options/restaurantBar') && !!cityId;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 right-6 z-50">
      <a
        href="https://www.opentable.com"
        target="_blank"
        rel="noopener noreferrer"
        title={lang === 'en' ? 'Book a table on OpenTable' : 'Reservar en OpenTable'}
        className="w-16 h-16 bg-[#da3743] hover:bg-[#b82d38] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90 hover:scale-105"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
        </svg>
      </a>
    </div>
  );
}