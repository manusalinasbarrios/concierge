import React from 'react';

interface Match {
  id: number;
  localTeam: string;
  awayTeam: string;
  matchDay: string;
  startHour: string | null;
  stadium: string;
  description: string;
  fase: string;
  localScore?: number | null;
  awayScore?: number | null;
  status?: 'scheduled' | 'live' | 'finished';
}

export default function CityMatches({ matches, lang }: { matches: Match[], lang: string }) {
  if (matches.length === 0) return null;

  return (
    <section className="my-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter text-foreground border-l-4 border-red-600 pl-4 leading-none">
        {lang === 'en' ? 'City Matches' : 'Partidos en la Ciudad'}
      </h2>
      <div className="grid gap-6">
        {matches.map((match) => (
          <div key={match.id} className="p-6 bg-card/40 backdrop-blur-md border border-foreground/10 rounded-3xl shadow-xl hover:border-foreground/20 transition-all group overflow-hidden relative">
             {/* Decorative Background Icon */}
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 2 1 2h6l1-2"/><path d="M4 15c0 3 3 3 5 5h6c2-2 5-2 5-5V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z"/><path d="M4 10h16"/><path d="M9 22v-2"/><path d="M15 22v-2"/></svg>
             </div>

            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-lg shadow-blue-900/20">
                {match.matchDay} {match.startHour ? `| ${match.startHour.substring(0, 5)}` : ''}
              </span>
              <span className="text-sm font-bold text-foreground uppercase tracking-widest">
                {match.status === 'live' ? (
                  <span className="flex items-center gap-2 text-red-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  match.fase
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 md:gap-12 relative z-10">
              <div className="flex-1 text-center">
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-widest text-foreground group-hover:text-blue-500 transition-colors break-words">
                  {match.localTeam}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-4 bg-foreground/5 px-6 py-2 rounded-2xl border border-foreground/10">
                <span className="text-xl md:text-2xl font-black tabular-nums">
                  {match.status !== 'scheduled' ? match.localScore ?? '-' : '-'}
                </span>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-500">
                     <span className="text-[10px] font-black text-foreground/50 italic">VS</span>
                  </div>
                </div>

                <span className="text-xl md:text-2xl font-black tabular-nums">
                  {match.status !== 'scheduled' ? match.awayScore ?? '-' : '-'}
                </span>
              </div>

              <div className="flex-1 text-center">
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-widest text-foreground group-hover:text-blue-500 transition-colors break-words">
                  {match.awayTeam}
                </h3>
              </div>
            </div>

          
            
            {/* Bottom Glow Effect */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        ))}
      </div>
    </section>
  );
}