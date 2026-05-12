import React from 'react';
import { getDictionary } from '../get-dictionary';
import Link from 'next/link';

// This interface matches the standard Strapi v4 response structure.
// Adjust attributes to match your specific collection fields.
interface CityItem {
  id: number;
  name: string;
  description: string;
}
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getStrapiContent(lang: string) {
  // We use localhost:1337 which is the default for Strapi.
  // We pass the ?locale parameter to Strapi
  const res = await fetch(`${STRAPI_URL}/api/cities?`, {
    cache: 'no-store', // Ensures you always get the latest data from Strapi
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
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
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">




      <div className="flex flex-col gap-6">
        <h1
          className="text-6xl font-bold mb-2 text-foreground text-green-800 uppercase text-center"
        >
        {lang === 'en' ? 'CITY GUIDE' : 'GUÍA DE LA CIUDAD'}</h1>
        <h1 className='text-5xl font-semibold text-foreground'>{lang === 'en' ? 'DINING, DRINKS & AFTER DARK' : 'CENA, BEBIDAS Y OCIO NOCTURNO'}</h1>


        {items.map((item) => (
          <Link key={item.id} href={`cities/options?lang=${lang}&city=${item.id}`}
            className='text-center'
          >
            <article style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }} className="hover:bg-foreground/5 transition-colors">
              <h2 className='text-3xl' style={{
                marginTop: 0, textTransform: 'uppercase'
              }}>{item.name}</h2>

            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}