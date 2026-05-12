import React from 'react';
import { getDictionary } from '../../../get-dictionary';
import ExploreServicesLink from '../../../../app/components/ExploreServicesLink';
import ReturnToCityLink from '../../../../app/components/ReturnToCityLink';

interface Match {
  id: number;
  localTeam: string;
  awayTeam: string;
  matchDay: string;
  startHour: string | null;
  stadium: string;
  description: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

async function getMatches(cityId: string, lang: string) {
  // Using the API structure provided in your request
  const url = `${STRAPI_URL}/api/partidos?filters[city][documentId][$eq]=${cityId}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch matches');
  }

  const json = await res.json();
  return json.data as Match[];
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; city?: string }>;
}) {
  const sParams = await searchParams;
  const lang = sParams.lang || 'es';
  const cityId = sParams.city;
  const dict = await getDictionary(lang);

  if (!cityId) {
    return (
      <main className="max-w-screen-md mx-auto my-8 p-4 font-sans text-center">
        <p className="text-red-500">Error: No city selected.</p>
        <ReturnToCityLink lang={lang} />
      </main>
    );
  }

  const matches = await getMatches(cityId, lang);

  return (
    <main className="max-w-screen-lg mx-auto my-8 p-4">
      <div className="mb-6">
        <ExploreServicesLink lang={lang} cityId={cityId} dict={dict} />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-foreground">{dict.options.matches}</h1>

      <div className="grid gap-6">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="p-6 border border-gray-200 rounded-lg   shadow-sm transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-400/10 px-2 py-1 rounded">
                  {match.matchDay} {match.startHour ? `| ${match.startHour.substring(0, 5)}` : ''}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{match.stadium}</span>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 text-xl font-bold">
                <span className="flex-1 text-right">{match.localTeam}</span>
                <span className="text-gray-500 text-sm">VS</span>
                <span className="flex-1 text-left">{match.awayTeam}</span>
              </div>
              <p className="text-gray-500 text-sm italic border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                {match.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            No matches found for this city.
          </p>
        )}
      </div>
    </main>
  );
}