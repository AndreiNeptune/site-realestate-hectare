'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface HeroImageProps extends ImageProps {
  containerClassName?: string;
  noTransition?: boolean;
}

export default function HeroImage({ 
  src, 
  alt, 
  className, 
  containerClassName = "", 
  noTransition = false,
  ...props 
}: HeroImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`overflow-hidden ${containerClassName}`}>
      {/* Brand Placeholder - Using Blue Accent */}
      <div 
        className={`absolute inset-0 bg-blue-600 transition-opacity duration-700 ${
          isLoaded || noTransition ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      <Image
        src={src}
        alt={alt}
        className={`${noTransition ? '' : 'transition-all duration-700 ease-out'} ${
          isLoaded || noTransition ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-105'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
