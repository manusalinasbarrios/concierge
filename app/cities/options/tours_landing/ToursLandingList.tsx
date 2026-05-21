'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { fetchTours, Tour } from './actions';

interface ToursLandingListProps {
  initialTours: Tour[];
  cityId: string;
  lang: string;
  pageSize: number;
  initialPage: number;
  strapiUrl: string;
}

function TourCard({ 
  tour, 
  lang, 
  strapiUrl, 
  index, 
  priority 
}: { 
  tour: Tour; 
  lang: string; 
  strapiUrl: string; 
  index: number;
  priority?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const images = tour.images && tour.images.length > 0 ? tour.images : [];
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tour.images]);

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${strapiUrl}${url}`;
  };

  const imagesToCycle = tour.images && tour.images.length > 0 ? tour.images : (tour.coverImage ? [tour.coverImage] : []);

  if (tour.portada) {
    return (
      <article className="w-full overflow-hidden rounded-2xl shadow-xl bg-background border border-foreground/5 flex flex-col">
        <div className="relative w-full h-[30vh] md:h-[80vh] overflow-hidden">
          {imagesToCycle.map((img, idx) => (
            <Image
              key={idx}
              src={getImageUrl(img.url)}
              alt={img.alternativeText || tour.name}
              fill
              className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              priority={priority && idx === 0}
            />
          ))}
        </div>
        {!tour.onlyCoverImage && (
          <div className="p-8 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">{tour.name}</h2>
            <p className={`text-xl text-foreground/80 leading-relaxed mb-2 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
              {tour.description}
            </p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 font-bold uppercase text-xs mb-6 block mx-auto"
            >
              {isExpanded ? (lang === 'en' ? 'Read Less' : 'Leer menos') : (lang === 'en' ? 'Read More' : 'Leer más')}
            </button>
            {tour.externalLink && (
              <a href={tour.externalLink} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 bg-red-600 text-white font-bold rounded-full uppercase tracking-widest hover:scale-105 transition-transform">
                {lang === 'en' ? 'Book Now' : 'Reservar Ahora'}
              </a>
            )}
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="w-full rounded-3xl overflow-hidden shadow-xl bg-background border border-foreground/5 group flex flex-col">
      <div className="relative w-full h-[500px] overflow-hidden">
        {imagesToCycle.map((img, idx) => (
          <Image
            key={idx}
            src={getImageUrl(img.url)}
            alt={img.alternativeText || tour.name}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'} group-hover:scale-105 transition-transform duration-700`}
            priority={priority && idx === 0}
          />
        ))}
        <div className={`absolute inset-0 flex items-end p-2 md:p-2 ${isEven ? 'justify-start' : 'justify-end'}`}>
          <div className="max-w-xl p-4 bg-black/70 rounded-2xl space-y-4 text-white border border-white/10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">{tour.name}</h2>
            <p className={`text-lg md:text-xl leading-relaxed text-justify opacity-90 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-1 md:line-clamp-4'}`}>
              {tour.description}
            </p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 font-bold uppercase text-xs block"
            >
              {isExpanded ? (lang === 'en' ? 'Read Less' : 'Leer menos') : (lang === 'en' ? 'Read More' : 'Leer más')}
            </button>
          </div>
        </div>
        {tour.externalLink && (
          <a href={tour.externalLink} target="_blank" rel="noopener noreferrer" className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors z-20">
            {lang === 'en' ? 'Book Experience' : 'Reservar Experiencia'}
          </a>
        )}
      </div>

      
    </article>
  );
}

export default function ToursLandingList({
  initialTours,
  cityId,
  lang,
  pageSize,
  initialPage,
  strapiUrl,
}: ToursLandingListProps) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTours.length >= pageSize);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const res = await fetchTours(cityId, lang, nextPage, pageSize);
      if (res.data && res.data.length > 0) {
        setTours((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        if (res.data.length < pageSize) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more tours:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {tours.map((tour, index) => (
        <TourCard 
          key={tour.id} 
          tour={tour} 
          index={index} 
          lang={lang} 
          strapiUrl={strapiUrl} 
          priority={index === 0}
        />
      ))}
      <div ref={observerTarget} className="h-3 flex items-center justify-center">
        {loading && (
          <div className="flex gap-1"><div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div><div className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:-.3s]"></div><div className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:-.5s]"></div></div>
        )}
      </div>
    </div>
  );
}