'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';

interface City {
  id: number;
  documentId: string;
  name: string;
}

export default function CitySelector({ cities = [], lang }: { cities: City[], lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityName = searchParams.get('cityName');
  const activeLang = searchParams.get('lang') || lang || 'en';

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="fixed top-0 z-[60] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-foreground/10 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">


            {cityName && (
              <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground truncate">
                {cityName}
              </h1>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-foreground/5 transition-colors"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="12" y1="6" y2="6" /><line x1="12" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300 animate-in fade-in"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed bg-white top-0 right-0 h-full w-80 bg-background z-[80] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-foreground/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>

          <nav className="flex-1 bg-white overflow-y-auto px-6 py-4 mt-5">
            <ul className="space-y-4 text-right mt-20" >
              <li>
                <Link
                  href={`/?lang=${activeLang}`}
                  className="text-xl font-medium uppercase text-green-800 transition-colors block"
                  onClick={toggleMenu}
                >
                  Welcome
                </Link>
              </li>

              {cities.map((city) => (
                <li key={city.documentId}>
                  <Link
                    href={`/cities/options?lang=${activeLang}&city=${city.documentId}&cityName=${city.name}`}
                    className={`font-medium uppercase htext-green-800 transition-colors block ${cityName === city.name ? 'text-4xl text-green-800 font-bold' : 'text-3xl text-green-800/70'}`}
                    onClick={toggleMenu}
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://www.adidas.mx/stores#/" target='_blank'
                  className="text-2xl font-medium uppercase text-green-800/70 hover:text-green-800 transition-colors block mt-10"
               >
                  {'Adidas Store'}
                </a>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
