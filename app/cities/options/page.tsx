import React from 'react';
import { getDictionary } from '../../get-dictionary';
import Link from 'next/link';
import CityHeaderImage from '../../components/CityHeaderImage';


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'; 

export async function getCityName(cityId: string, lang: string): Promise<any | null> {
  const res = await fetch(`${STRAPI_URL}/api/cities/${cityId}?locale=${lang}&populate=citieHomePageImage`, {
    cache: 'no-store', // Ensures you always get the latest data from Strapi
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    //next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) return null;

  const json = await res.json();
  return json.data;
  
}

export default async function OptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string, city?: string , cityName?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const city = sParams.city;
  const cityName = sParams.cityName || ''; // Fallback if cityName is not provided
  const dict = await getDictionary(lang);

  // Fetch city data for the header image
  const cityData = city ? await getCityName(city, lang) : null;
  const headerImages = cityData?.citieHomePageImage || [];

  const options = [
    { key: 'contacts', label: dict.options.contacts, icon: '/img/contact.svg' },
    { key: 'matches', label: dict.options.matches, icon: '/img/matches.svg' },
    { key: 'transports', label: dict.options.transport, icon: '/img/transport.svg' },
    { key: 'restaurantBar', label: dict.options.restaurantBar, icon: '/img/restaurantBar.svg' },
    { key: 'tours_landing', label: dict.options.tour, icon: '/img/tour.svg' },
    { key: 'emergency', label: dict.options.emergency, icon: '/img/emergency.svg' },
  ];

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      {headerImages.length > 0 && (
        <CityHeaderImage images={headerImages} cityName={cityName} strapiUrl={STRAPI_URL} />
      )}

      <div className="max-w-screen-md mx-auto mb-6">
        <h1 className="text-3xl font-bold text-foreground uppercase"
        >
          {cityData?.title  || 'City Options'}
        </h1>
        <p className="text-lg text-foreground/70 mt-2 text-justify">
          {cityData?.description || 'Explore the various options available for this city.'}
        </p>
      </div>
      
      <ul className="list-none p-0 max-w-md mx-auto grid">
        {options.map((option) => (
          <li key={option.key} className="mb-4">
            <Link 
              href={`/cities/options/${option.key}?lang=${lang}${city ? `&city=${city}` : ''}${cityName ? `&cityName=${cityName}` : ''}`}
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