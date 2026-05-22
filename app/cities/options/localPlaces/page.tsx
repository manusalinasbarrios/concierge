import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';
import LocalPlaces from '@/app/components/LocalPlaces';
import fs from 'fs/promises';
import path from 'path';

async function getLocalPlaces() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'lugares.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading lugares.json:', error);
    return [];
  }
}

export default async function LocalPlacesPage({
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

  const places = await getLocalPlaces();

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} cityName={cityName} />
      </div>

      {places.length > 0 ? (
        <LocalPlaces places={places} lang={lang} />
      ) : (
        <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
          {lang === 'en' ? 'No recommendations available.' : 'No hay recomendaciones disponibles.'}
        </p>
      )}
    </main>
  );
}