'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface EstadioProps {
  name: string;
  description: string;
  location: string;
  image: {
    url: string;
    alternativeText: string | null;
  }[] | null;
  strapiUrl: string;
  lang?: string;
}

export default function EstadioComponent({ name, description, location, image, strapiUrl, lang = 'en' }: EstadioProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!image || image.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % image.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [image]);

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${strapiUrl}${url}`;
  };
  
  return (
    <section className="my-10 bg-background/50 rounded-3xl overflow-hidden shadow-2xl border border-foreground/10 group animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row">
        {/* Stadium Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-[450px] overflow-hidden">
          {image && image.length > 0 ? (
            image.map((img, idx) => (
              <Image
                key={idx}
                src={getImageUrl(img.url)}
                alt={img.alternativeText || name}
                fill
                className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'} group-hover:scale-105 transition-transform duration-700`}
              />
            ))
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
               <span className="text-muted-foreground">Stadium Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Stadium Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-card/30 backdrop-blur-sm">
          <div>
           
            <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter text-foreground leading-none">
              {name}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6 text-justify">
              {description}
            </p>
          </div>
          
          <div className="space-y-4">
             {/* Google Maps Embed */}
             <div className="rounded-2xl overflow-hidden h-44 border border-foreground/10 shadow-inner">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1) brightness(0.9)' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"

                    src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&z15&hl=${lang}&output=embed`}
                ></iframe>
             </div>
             <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}&hl=${lang}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 font-bold uppercase text-sm hover:text-blue-400 transition-colors w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Navigate to Stadium
              </a>
          </div>
        </div>
      </div>
    </section>
  );
}