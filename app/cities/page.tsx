import React from 'react';
import { getDictionary } from '../get-dictionary';
import Link from 'next/link';

// This interface matches the standard Strapi v4 response structure.
// Adjust attributes to match your specific collection fields.
export interface CityItem {
  id: number;
  documentId: string;
  name: string;
  description: string;
  className: string;
  estadioName: string;
  estadioDescription: string;
  estadioLocation: string;
  estadioImage: {
    url: string;
    alternativeText: string | null;
  } | null;
  selectorImages: {
    url: string;
    alternativeText: string | null;
  }[];
  citiHomePageImage: {
    url: string;
    alternativeText: string | null;
  }[] | null;
}
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getStrapiContent(lang: string) {
  // We use localhost:1337 which is the default for Strapi.
  // We pass the ?locale parameter to Strapi
  const res = await fetch(`${STRAPI_URL}/api/cities?locale=${lang}&populate=selectorImages&sort=order:asc`, {
    cache: 'no-store', // Ensures you always get the latest data from Strapi
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
   // next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from Strapi');
  }

  const json = await res.json();
  return json.data as CityItem[];
}

export default async function StrapiPage({
  searchParams
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';

  const dict = await getDictionary(lang);
  const items = await getStrapiContent(lang);

  return (
    <div className="main-page-gradient w-full p-4 md:p-8">

      <main className="max-w-screen-xl mx-auto my-8 p-1 font-sans">
        <div className="flex flex-col gap-6">
          {items.map((item) => {
            const imageUrl = item.selectorImages?.[0]?.url;
            const fullImageUrl = imageUrl
              ? (imageUrl.startsWith('http') ? imageUrl : `${STRAPI_URL}${imageUrl}`)
              : null;

            return (
              <Link
                key={item.documentId}
                href={`cities/options?lang=${lang}&city=${item.documentId}&cityName=${item.name}`}
                className="block group"
              >
                <div
                  className="relative h-64 w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:scale-[1.01] flex items-end justify-center pb-2 md:pb-2"
                  style={{
                    backgroundImage: fullImageUrl ? `url(${fullImageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Dark Overlay to make text pop */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                  <article className={`relative z-10 px-4 py-3 md:px-12 md:py-4 text-center rounded-full shadow-2xl ${item.className || ''}`}>
                    <h2 className="text-2xl md:text-2xl font-black uppercase tracking-widest drop-shadow-2xl leading-none">
                      {item.name}
                    </h2>
                  </article>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}