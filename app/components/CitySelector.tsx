'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface City {
  id: number;
  name: string;
}

export default function CitySelector({ cities, lang }: { cities: City[], lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hide on the main page where the full city list is already shown
  if (pathname === '/') return null;

  const currentCityId = searchParams.get('city');

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    if (!cityId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('city', cityId);

    // When changing city, navigate to the main options menu for that city
    router.push(`/options?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 p-4 vertical md:horizontal">
      <div className="w-8 h-8 flex-shrink-0 py-1 " onClick={() => router.push('/')} >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>

      </div>
      <select
        id="city-switcher"
        value={currentCityId || ''}
        onChange={handleCityChange}
        className="bg-transparent border border-foreground/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/50 cursor-pointer"
      >
        {cities.map((city) => (
          <option key={city.id} value={city.id} className="bg-background text-foreground">
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}