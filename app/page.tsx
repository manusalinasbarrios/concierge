import React from 'react';
import { getDictionary } from './get-dictionary';
import Link from 'next/link';
import Image from 'next/image';
import localFont from 'next/font/local';
import mexicoLogo from '../public/img/simbolo_mexico.png';

// Load the specific font from your /public/fonts directory.
const welcomeFont = localFont({
  src: '../public/fonts/Mercadillo-Bold.ttf', // Replace 'your-font-file.ttf' with your actual filename
  display: 'swap',
});

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
    //next: { revalidate: 3600 }, // Cache for 1 hour
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
 // const welcomeData = await getWelcomePage(lang);

  return (
    <div className="main-page-gradient w-full flex-1 flex flex-col">
      <main className="flex flex-col items-center justify-center max-w-screen-lg mx-auto my-8 p-4 font-sans">
        {true && (
          <section className="text-center text-(#35633f) mb-16 py-8 border-foreground/5">
            <h1 className={`${welcomeFont.className} text-5xl md:text-5xl font-extrabold text-foreground mb-4 uppercase text-white-800`}>
              {"Welcome"}
            </h1>
             <div className="flex justify-center py-12">
            <Image
            src={mexicoLogo}
            alt="Powered by 24/7"
            width={240}
            height={120}
            priority
          />
        </div>
            <br />
            <p className="text-2xl md:text-xl text-white-500 max-w mx-auto"
           
            >

              {"Welcome to a World Cup experience, inspired by the spirit of Mexico."}
            </p>
            <br />
              <p className="text-2xl md:text-xl text-white-500 max-w mx-auto"
           
            >

              {"Bienvenido a una experiencia de la Copa del Mundo, inspirada en el espíritu de México."}
            </p>
          </section>
        )}

         
        <div className="flex justify-center py-5">
          <Link
            href={`/cities?lang=en`}
            className="bg-foreground bg-white text-green-800 rounded-tl-full rounded-br-full m-4 px-8 py-5 font-bold text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
            style={{
              textTransform: 'uppercase',
              //borderRadius: '0 50% 0 50%'
            }}
         >
            English
          </Link>
           <Link
            href={`/cities?lang=es`}
            className="bg-foreground bg-red-600 text-white rounded-tl-full rounded-br-full text-background m-4 px-8 py-5 font-bold text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
            style={{
              textTransform: 'uppercase',
              //borderRadius: '90% 0 90% 0'
            }}
         >
            Español
          </Link>
        </div>
      </main>
    </div>
  );
}