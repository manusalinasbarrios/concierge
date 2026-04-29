import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { headers } from "next/headers";
import LanguageSwitcher from "./components/LanguageSwitcher";
import CitySelector from "./components/CitySelector";
import ThemeSwitcher from "./components/ThemeSwitcher";
import FloatingContactButton from "./components/FloatingContactButton";
import FloatingWeatherWidget from "./components/FloatingWeatherWidget";


const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';


async function getCities(lang: string) {
  const res = await fetch(`${STRAPI_URL}/api/cities?locale=${lang}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as { id: number; name: string }[];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  const lang = headerList.get('x-lang') || 'es';
  const theme = headerList.get('x-theme') || 'light';
  const cities = React.use(getCities(lang));

  return (
    <html lang={lang} className={`${theme} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="flex justify-between items-center border-b border-foreground/10">
          <React.Suspense fallback={<div className="p-4">...</div>}>
            <CitySelector cities={cities} lang={lang} />
          </React.Suspense>

          <div className="flex items-center gap-2 pr-4">
            <LanguageSwitcher />
          </div>
        </header>
        {children}
        <React.Suspense fallback={null}>
          <FloatingContactButton lang={lang} />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <FloatingWeatherWidget lang={lang} />
        </React.Suspense>
      </body>
    </html>
  );
}
