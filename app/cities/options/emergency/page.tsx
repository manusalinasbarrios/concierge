import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';

interface Emergency {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  phone: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getEmergencies(cityId: string) {
  const url = `${STRAPI_URL}/api/emergencias?filters[city][id][$eq]=${cityId}`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch emergencies');
  }

  const json = await res.json();
  return json.data as Emergency[];
}

export default async function EmergenciesPage({
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

  const emergencies = await getEmergencies(cityId);

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.emergency}</h1>

      <div className="grid gap-6">
        {emergencies.length > 0 ? (
          emergencies.map((emergency) => (
            <article key={emergency.id} className="border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{emergency.name}</h2>
                {emergency.description && (
                  <p className="text-gray-300 mb-2 leading-relaxed">{emergency.description}</p>
                )}
                <p className="text-red-400 font-mono text-lg">{emergency.phone}</p>
              </div>
              <a
                href={`tel:${emergency.phone}`}
                className="inline-block text-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20"
              >
                {lang === 'en' ? 'Call Now' : 'Llamar Ahora'}
              </a>
            </article>
          ))
        ) : (
          <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
            {lang === 'en' ? 'No emergency services available for this city.' : 'No hay servicios de emergencia disponibles para esta ciudad.'}
          </p>
        )}
      </div>
    </main>
  );
}