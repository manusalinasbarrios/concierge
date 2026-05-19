'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeaderImage {
    url: string;
    alternativeText: string | null;
}

export default function CityHeaderImage({
    images,
    cityName,
    strapiUrl
}: {
    images: HeaderImage[];
    cityName: string;
    strapiUrl: string;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl bg-black/20">
            {images.map((image, index) => (
                <Image
                    key={index}
                    src={image.url.startsWith('http') ? image.url : `${strapiUrl}${image.url}`}
                    alt={image.alternativeText || "City header"}
                    fill
                    className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    priority={index === 0}
                />
            ))}

            <div className="absolute top-3 left-0 right-0 z-10 text-center px-4 pointer-events-none">
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase  drop-shadow-2xl">
                    {cityName}
                </h2>
            </div>
        </div>
    );
}