import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';
import RestaurantList from './RestaurantList';
import { fetchRestaurants } from './actions';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const INITIAL_PAGE = 1; // Using 0 as per your initial implementation
const PAGE_SIZE = 5;

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; city?: string; cityName?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const cityId = sParams.city;
  const cityName = sParams.cityName || '';
  const dict = await getDictionary(lang);

  if (!cityId) {
    return (
      <main className="max-w-screen-md mx-auto my-8 p-4 font-sans text-center">
        <p className="text-red-500">Error: No city selected.</p>
        <ReturnToCityLink lang={lang} />
      </main>
    );
  }

  const { data: initialRestaurants } = await fetchRestaurants(cityId, lang, INITIAL_PAGE, PAGE_SIZE);

  return (
    <main className="max-w-screen-xl mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} cityName={cityName} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.restaurant}</h1>

      {initialRestaurants.length > 0 ? (
        <RestaurantList 
          initialRestaurants={initialRestaurants} 
          cityId={cityId} 
          lang={lang} 
          pageSize={PAGE_SIZE}
          initialPage={INITIAL_PAGE}
          strapiUrl={STRAPI_URL}
        />
      ) : (
        <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
          {lang === 'en' ? 'No restaurants available for this city.' : 'No hay restaurantes disponibles para esta ciudad.'}
        </p>
      )}
    </main>
  );
}