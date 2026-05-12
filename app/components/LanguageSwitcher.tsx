'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = searchParams.get('lang') || 'es';

  const handleLanguageChange = (newLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-end gap-2 p-4">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentLang === 'en'
            ? 'bg-foreground text-background'
            : 'bg-transparent border border-foreground/20 hover:bg-foreground/5'
        }`}
        style={{
          textTransform: 'uppercase'
        }}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentLang === 'es'
            ? 'bg-foreground text-background'
            : 'bg-transparent border border-foreground/20 hover:bg-foreground/5'
        }`}
        style={{
          textTransform: 'uppercase'
        }}
      >
        Español
      </button>
    </div>
  );
}