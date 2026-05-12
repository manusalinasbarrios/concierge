import React from 'react';
import { getDictionary } from '../../get-dictionary';
import Link from 'next/link';

export default async function OptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string, city?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const city = sParams.city;
  const dict = await getDictionary(lang);

  const options = [
    { key: 'contacts', label: dict.options.contacts, icon: '/img/contact.svg' },
    { key: 'matches', label: dict.options.matches, icon: '/img/matches.svg' },
    { key: 'transports', label: dict.options.transport, icon: '/img/transport.svg' },
    { key: 'restaurantBar', label: dict.options.restaurantBar, icon: '/img/restaurantBar.svg' },
    { key: 'tours', label: dict.options.tour, icon: '/img/tour.svg' },
    { key: 'emergency', label: dict.options.emergency, icon: '/img/emergency.svg' },
  ];

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      <div className="max-w-screen-md mx-auto mb-6">
      <h1 className="text-5xl font-bold mb-6 text-foreground text-center text-green-800 uppercase"
        
      >{dict.explore_options}</h1>
        </div>
      
      
      <ul className="list-none p-0 max-w-md mx-auto grid">
        {options.map((option) => (
          <li key={option.key} className="mb-4">
            <Link 
              href={`/cities/options/${option.key}?lang=${lang}${city ? `&city=${city}` : ''}`}
              className="flex items-center gap-4 p-4 px-15 border border-gray-200 rounded-lg text-foreground transition-colors duration-200 ease-in-out text-lg group"
            >
              <div
                className="w-8 h-8 group-hover:scale-110 transition-transform flex-shrink-0 bg-current"
                style={{
                  maskImage: `url(${option.icon})`,
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center',
                  color: 'currentColor',
                }}
                aria-hidden="true"
              />
              <span className='text-2xl' style={{
                textTransform: 'uppercase',
              }} >{option.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}