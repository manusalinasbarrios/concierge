import React from 'react';

interface Lugar {
  nombre: string;
  ubicacion: string;
}

interface CategoriaLugar {
  categoria: string;
  zona: string;
  lugares: Lugar[];
}

const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Restaurantes': {
    en: 'Restaurants',
    es: 'Restaurantes',
  },
  'Cafeterías': {
    en: 'Coffee Shops',
    es: 'Cafeterías',
  },
  'Farmacias y hospitales': {
    en: 'Pharmacies & Hospitals',
    es: 'Farmacias y hospitales',
  },
  'Cafeterías/Restaurantes': {
    en: 'Cafés/Restaurants',
    es: 'Cafeterías/Restaurantes',
  },
};

const SORT_ORDER: Record<string, number> = {
  'Cafeterías': 1,
  'Restaurantes': 2,
  'Cafeterías/Restaurantes': 3,
  'Farmacias y hospitales': 4,
};

export default function LocalPlaces({ places, lang }: { places: CategoriaLugar[], lang: string }) {
  if (!places || places.length === 0) return null;

  const getTranslatedCategory = (category: string) => {
    return CATEGORY_TRANSLATIONS[category]?.[lang] || category;
  };

  const sortedPlaces = [...places].sort((a, b) => {
    const weightA = SORT_ORDER[a.categoria] || 99;
    const weightB = SORT_ORDER[b.categoria] || 99;
    return weightA - weightB;
  });

  return (
    <section className="my-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter text-foreground border-l-4 border-green-600 pl-4 leading-none">
        {lang === 'en' ? 'Local Recommendations' : 'Recomendaciones Locales'}
      </h2>
      
      <div className="space-y-6">
        {sortedPlaces.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-card/40 backdrop-blur-md border border-foreground/10 rounded-3xl p-6 shadow-xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2 border-b border-foreground/5 pb-4">
              <div>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight leading-none mb-1">
                  {getTranslatedCategory(group.categoria)}
                </h3>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                  {group.zona}
                </p>
              </div>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {group.lugares.map((lugar, idx) => (
                <li key={idx}>
                  <a 
                    href={lugar.ubicacion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.03] hover:bg-foreground/10 border border-foreground/5 transition-all group active:scale-95"
                  >
                    <span className="font-bold text-foreground/70 group-hover:text-foreground transition-colors uppercase text-sm tracking-wide">
                      {lugar.nombre}
                    </span>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}