import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import Image from 'next/image';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';


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
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getRestaurants(cityId: string) {
  // Endpoint provided in the request
  const url = `${STRAPI_URL}/api/restaurantes?filters[city][id][$eq]=${cityId}&populate=avatar`;

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
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
        <ReturnToCityLink lang={lang} />
      </main>
    );
  }

  const restaurants = await getRestaurants(cityId);

  return (
    <main className="max-w-screen-xl mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.restaurant}</h1>

      <div className="grid gap-8">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <article key={restaurant.id} className="overflow-hidden border border-gray-200 rounded-xl shadow-lg flex flex-col m-4">

              {restaurant.avatar ? (
                <div className="relative w-full h-64">
                  <Image
                    src={`${restaurant.avatar.url.startsWith('http') ? restaurant.avatar.url : `${STRAPI_URL}${restaurant.avatar.url}`}`}
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
              <div className="p-6">
                <h2 className="text-4xl font-bold mb-3">{restaurant.name}</h2>
                <p className="text-2xl mb-6 leading-relaxed ">{restaurant.description}</p>
                {restaurant.restaurantUrl && (
                  <a
                    href={restaurant.restaurantUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors group"
                  >
                    <div
                      className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0 bg-current"
                      style={{
                        maskImage: "url('/img/map-pin.svg')",
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',
                        maskPosition: 'center',
                      }}
                      aria-hidden="true"
                    />
                    <span className='text-3xl'
                      style={{
                        textTransform: 'uppercase'
                      }}
                    >{lang === 'en' ? 'Location' : 'Ubicación'}</span>
                  </a>
                )}
              </div>

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