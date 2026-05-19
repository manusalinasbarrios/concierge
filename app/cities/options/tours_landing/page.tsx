import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import Image from 'next/image';
import ExploreServicesLink from '../../../components/ExploreServicesLink';
import ReturnToCityLink from '../../../components/ReturnToCityLink';
import ToursLandingList from './ToursLandingList';
import { fetchTours } from './actions';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const PAGE_SIZE = 5;
const INITIAL_PAGE = 1;

export default async function ToursPage({
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

  const { data: initialTours } = await fetchTours(cityId, lang, INITIAL_PAGE, PAGE_SIZE);

  return (
    <main className="max-w-screen-xl mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} cityName={cityName} />
      </div>
      
      {initialTours.length > 0 ? (
        <ToursLandingList
          initialTours={initialTours}
          cityId={cityId}
          lang={lang}
          pageSize={PAGE_SIZE}
          initialPage={INITIAL_PAGE}
          strapiUrl={STRAPI_URL}
        />
      ) : (
          <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
            {lang === 'en' ? 'No tours available for this city.' : 'No hay tours disponibles para esta ciudad.'}
          </p>
      )}
    </main>
  );
}