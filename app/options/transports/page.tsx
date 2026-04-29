import React from 'react';
import { getDictionary } from '../../get-dictionary';
import Link from 'next/link';

interface Transport {
  id: number;
  name: string;
  platfomUrl: string | null;
  category: string;
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function getTransport(cityId: string, lang: string) {
  // Using the API structure and filters provided in your request
  const url = `${STRAPI_URL}/api/transportes?filters[cities][id][$eq]=${cityId}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch transport data');
  }

  const json = await res.json();
  return json.data as Transport[];
}

// Mapping categories to SVG icons (assuming they are in your public folder like in options/page.tsx)
const CATEGORY_ICONS: Record<string, string> = {
  taxi: '/img/taxi.svg',
  train: '/img/train.svg',
  car: '/img/car.svg',
  bus: '/img/bus.svg',
};

export default async function TransportPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; city?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const cityId = sParams.city;
  const dict = await getDictionary(lang);

  if (!cityId) {
    return (
      <main className="max-w-screen-md mx-auto my-8 p-4 font-sans text-center">
        <p className="text-red-500">Error: No city selected.</p>
        <Link href={`/?lang=${lang}`} className="text-blue-500 hover:underline mt-4 inline-block">
          Return to city selection
        </Link>
      </main>
    );
  }

  const transportOptions = await getTransport(cityId, lang);

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      <div className="mb-6">
        <Link href={`/options?lang=${lang}&city=${cityId}`} className="text-sm text-blue-500 hover:underline">
          &larr; {dict.explore_options}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.transport}</h1>

      <div className="grid gap-4">
        {transportOptions.length > 0 ? (
          transportOptions.map((item) => {
            const iconPath = CATEGORY_ICONS[item.category] || '/img/transport.svg';
            
            return (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between group hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 flex-shrink-0 bg-current"
                    style={{
                      maskImage: `url(${iconPath})`,
                      maskRepeat: 'no-repeat',
                      maskSize: 'contain',
                      maskPosition: 'center',
                    }}
                    aria-hidden="true"
                  />
                  <span className="text-xl font-semibold">{item.name}</span>
                </div>
                
                {item.platfomUrl && (
                  <a
                    href={item.platfomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {lang === 'en' ? 'Open App' : 'Abrir App'}
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
            {lang === 'en' ? 'No transport options found.' : 'No se encontraron opciones de transporte.'}
          </p>
        )}
      </div>
    </main>
  );
}