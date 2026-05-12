'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

export default function ThemeSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTheme = searchParams.get('theme') || 'dark';

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    const params = new URLSearchParams(searchParams.toString());
    params.set('theme', nextTheme);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-foreground/5 transition-colors border border-foreground/10"
      aria-label="Toggle Theme"
    >
      {currentTheme === 'light' ? (
        <span title="Switch to Dark Mode">🌙</span>
      ) : (
        <span title="Switch to Light Mode">☀️</span>
      )}
    </button>
  );
}