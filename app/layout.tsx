import type { Metadata } from "next";
import { mainFont } from "./fonts";
import "./globals.css";
import React from "react";
import Image from "next/image";
import { headers } from "next/headers";
import LanguageSwitcher from "./components/LanguageSwitcher";
import CitySelector from "./components/CitySelector";
import ThemeSwitcher from "./components/ThemeSwitcher";
import FloatingContactButton from "./components/FloatingContactButton";
import FloatingWeatherWidget from "./components/FloatingWeatherWidget";
import FloatingOpenTableButton from "./components/FloatingOpenTableButton";


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';


async function getCities(lang: string) {
  const res = await fetch(`${STRAPI_URL}/api/cities?locale=${lang}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as { id: number; name: string }[];
}

export const metadata: Metadata = {
  title: "Concierge 24/7",
  description: "Your personal assistant for city information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layouts can't access searchParams, so we read the header from middleware
  const headerList = React.use(headers());
  const lang = headerList.get('x-lang') || 'en';
  const theme = headerList.get('x-theme') || 'dark';
 // const cities = React.use(getCities(lang));

  return (
    <html lang={lang} className={`${theme} ${mainFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="flex justify-between items-center border-b border-foreground/10">
          <React.Suspense fallback={<div className="p-4">...</div>}>
            <CitySelector cities={[]} lang={lang} />
          </React.Suspense>

          
        </header>
        {children}
        
        <footer className="mt-auto py-12 border-foreground/10 flex flex-col items-center justify-center">
          <Image 
            src="/img/footer.svg" 
            alt="Footer Logo" 
           width={720} 
           height={240} 
           className="opacity-90"
          />
        </footer>

        <React.Suspense fallback={null}>
          <FloatingContactButton lang={lang} />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <FloatingOpenTableButton lang={lang} />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <FloatingWeatherWidget lang={lang} />
        </React.Suspense>
      </body>
    </html>
  );
}
