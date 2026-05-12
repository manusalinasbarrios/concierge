import Link from 'next/link';
import React from 'react';

export default function ReturnToCityLink({ lang }: { lang: string }) {
  const isEn = lang === 'en';
  
  return (
    <Link href={`/cities/?lang=${lang}`} className="text-blue-500 hover:underline mt-4 inline-block">
      {isEn ? 'Return to city selection' : 'Volver a la selección de ciudad'}
    </Link>
  );
}