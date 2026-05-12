import React from 'react';
import { getDictionary } from './get-dictionary';
import Link from 'next/link';

// This interface matches the standard Strapi v4 response structure.
// Adjust attributes to match your specific collection fields.
interface WelcomePageData {
  welcomeTitle: string;
  welcomeContent: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getWelcomePage(lang: string) {
  const res = await fetch(`${STRAPI_URL}/api/welcome-page?locale=${lang}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data as WelcomePageData;
}

export default async function StrapiPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ lang?: string }> 
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';

  const dict = await getDictionary(lang);
  const welcomeData = await getWelcomePage(lang);

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4 font-sans">
      {welcomeData && (
        <section className="text-center text-(#35633f) mb-16 py-8 border-b border-foreground/5">
          <h1 className="text-6xl md:text-5xl font-extrabold text-foreground mb-4 uppercase text-green-800" 
           
          >
            {welcomeData.welcomeTitle}
          </h1>
          <p className="text-2xl md:text-xl text-gray-500 max-w-2xl mx-auto"
          style={{
            textTransform:'uppercase'
          }}
          >

            {welcomeData.welcomeContent}
          </p>
        </section>
      )}

      <div className="flex justify-center py-12">
        <Link
          href={`/cities?lang=${lang}`}
          className="bg-foreground text-background px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
          style={{
            textTransform: 'uppercase',
          }}
       >
          {lang === 'en' ? 'Explore Cities' : 'Ver Ciudades'}
        </Link>
      </div>
    </main>
  );
}