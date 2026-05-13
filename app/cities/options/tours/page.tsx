import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import Image from 'next/image';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';

interface Tour {
  id: number;
  name: string;
  description: string;
  externalLink: string | null;
  coverImage: {
    url: string;
    alternativeText: string | null;
  } | null;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getTours(cityId: string, lang: string) {
  // Using the API structure and populate parameters provided
  const url = `${STRAPI_URL}/api/tours?filters[city][documentId][$eq]=${cityId}&populate=coverImage&locale=${lang}`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tours');
  }

  const json = await res.json();
  return json.data as Tour[];
}

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

  const tours = await getTours(cityId, lang);

  return (
    <main className="max-w-screen-xl mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} cityName={cityName} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.tour}</h1>

      <div className="grid gap-8">
        {tours.length > 0 ? (
          tours.map((tour) => (
            <article key={tour.id} className="overflow-hidden border border-gray-200 rounded-xl shadow-lg flex flex-col m-4">
              {tour.coverImage && (
                <div className="relative w-full h-64">
                  <Image
                    //src={`${STRAPI_URL}${tour.coverImage.url}`}
                    src={`${tour.coverImage.url.startsWith('http') ? tour.coverImage.url : `${STRAPI_URL}${tour.coverImage.url}`}`}
                    alt={tour.coverImage.alternativeText || tour.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">{tour.name}</h2>
                <p className="text-lg text-justify mb-6 leading-relaxed">{tour.description}</p>
                {tour.externalLink && (
                  <a
                    href={tour.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    {lang === 'en' ? 'Book Experience' : 'Reservar Experiencia'}
                  </a>
                )}
              </div>
            </article>
          ))
        ) : (
          <p className="text-gray-400 italic text-center py-12 border border-dashed border-gray-800 rounded-lg">
            {lang === 'en' ? 'No tours available for this city.' : 'No hay tours disponibles para esta ciudad.'}
          </p>
        )}
      </div>
    </main>
  );
}