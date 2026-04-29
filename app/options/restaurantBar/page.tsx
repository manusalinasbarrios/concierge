import React from 'react';
import { getDictionary } from '../../get-dictionary';
import Link from 'next/link';
import Image from 'next/image';



interface Restaurant {
  id: number;
  documentId: string;
  name: string;
  restaurantUrl: string | null;
  description: string;
  avatar: {
    url: string;
    alternativeText: string | null;
  } | null;

}
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function getRestaurants(cityId: string) {
  // Endpoint provided in the request
  const url = `${STRAPI_URL}/api/restaurantes?filters[city][id][$eq]=${cityId}&populate=avatar`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch restaurants');
  }

  const json = await res.json();
  return json.data as Restaurant[];
}

export default async function RestaurantsPage({
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

  const restaurants = await getRestaurants(cityId);

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      <div className="mb-6">
        <Link href={`/options?lang=${lang}&city=${cityId}`} className="text-sm text-blue-500 hover:underline">
          &larr; {dict.explore_options}
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.restaurant}</h1>

      <div className="grid gap-8">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <article key={restaurant.id} className="overflow-hidden border border-gray-200 rounded-xl shadow-lg flex flex-col p-6">
              <div className="flex-1">
                {restaurant.avatar ? (
                   <div className="relative w-full h-64">
                                    <Image 
                                      src={`${STRAPI_URL}${restaurant.avatar.url}`}
                                      alt={restaurant.avatar.alternativeText || restaurant.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-3">{restaurant.name}</h2>
                <p className="text-gray-400 mb-6 leading-relaxed whitespace-pre-wrap">{restaurant.description}</p>
              </div>
              {restaurant.restaurantUrl && (
                <a
                  href={restaurant.restaurantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                >
                  {lang === 'en' ? 'Visit Website / Book' : 'Visitar Sitio / Reservar'}
                </a>
              )}
            </article>
          ))
        ) : (
          <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
            {lang === 'en' ? 'No restaurants available for this city.' : 'No hay restaurantes disponibles para esta ciudad.'}
          </p>
        )}
      </div>
    </main>
  );
}