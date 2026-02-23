'use client';

import React, { useState, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { getImageUrl, Movie, tmdb } from '@/lib/tmdb';
import { LANGUAGE_MAP } from '@/lib/constants';

export const MovieCard = memo(({ movie, index }: { movie: Movie; index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailerFetched = useRef(false);

  const mediaType = movie.media_type || (movie.name && !movie.title ? 'tv' : 'movie');
  const href = `/player/${movie.id}?type=${mediaType}`;
  const langLabel = LANGUAGE_MAP[movie.original_language || ''] || movie.original_language?.toUpperCase();
  const year = new Date(movie.release_date || movie.first_air_date || '').getFullYear();
  const quality = movie.vote_average >= 8 ? '4K' : movie.vote_average >= 7 ? 'HDR' : 'HD';

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!trailerFetched.current) {
      hoverTimer.current = setTimeout(async () => {
        trailerFetched.current = true;
        try {
          const v = await tmdb.getVideos(mediaType as 'movie' | 'tv', movie.id);
          const t = v.results.find((x: any) => x.type === 'Trailer' || x.type === 'Teaser');
          if (t) setTrailerId(t.key);
        } catch {}
      }, 2000);
    }
  }, [movie.id, mediaType]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  return (
    <Link
      href={href}
      className="flex flex-col flex-shrink-0 cursor-pointer select-none outline-none group active:scale-95 transition-transform duration-150"
      style={{ width: 'clamp(112px, 30vw, 152px)' }}
    >
      {/* ── IMAGE SECTION ── */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '2/3',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(229,9,20,0.5)'
            : '0 6px 20px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Skeleton shimmer while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#1a1f2e] shimmer" />
        )}

        {/* Trailer iframe on hover */}
        {isHovered && trailerId ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&modestbranding=1`}
            className="absolute inset-0 w-full h-full scale-150 pointer-events-none"
            allow="autoplay"
          />
        ) : (
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title || movie.name || ''}
            fill
            sizes="(max-width:640px) 30vw,(max-width:1024px) 20vw,152px"
            className={`object-cover transition-opacity duration-400 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={index < 8 ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        )}

        {/* Hover dark overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.25s ease' }}
        />

        {/* ── LANGUAGE BADGE — top right ── */}
        {langLabel && (
          <div
            className="absolute top-0 right-0 text-white font-black uppercase z-10"
            style={{
              background: '#E50914',
              fontSize: '9px',
              padding: '3px 6px',
              borderBottomLeftRadius: '8px',
              letterSpacing: '0.06em',
            }}
          >
            {langLabel.slice(0, 3)}
          </div>
        )}

        {/* ── PLAY BUTTON — center on hover ── */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '38px',
              height: '38px',
              background: 'rgba(229,9,20,0.92)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 4px 20px rgba(229,9,20,0.6)',
            }}
          >
            <Play size={15} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      </div>

      {/* ── METADATA SECTION — strictly below image ── */}
      <div className="mt-2 px-0.5">

        {/* Row 1: Title + Year */}
        <div className="flex items-center justify-between gap-1">
          <p
            className="text-white font-bold truncate flex-1 leading-tight"
            style={{ fontSize: '11px', letterSpacing: '-0.01em' }}
          >
            {movie.title || movie.name}
          </p>
          <span
            className="text-gray-500 flex-shrink-0"
            style={{ fontSize: '10px' }}
          >
            {year > 1900 ? year : ''}
          </span>
        </div>

        {/* Row 2: Quality Badge + Rating Badge */}
        <div className="flex items-center justify-between mt-1">

          {/* Quality Badge */}
          <span
            className="text-white font-black"
            style={{
              fontSize: '8px',
              padding: '1.5px 5px',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '3px',
              background: 'rgba(0,0,0,0.45)',
              letterSpacing: '0.06em',
            }}
          >
            {quality}
          </span>

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <span
              className="flex items-center gap-1 text-white font-black"
              style={{
                fontSize: '9px',
                padding: '2px 6px',
                background: '#E50914',
                borderRadius: '3px',
              }}
            >
              <Star size={8} fill="white" className="text-white flex-shrink-0" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

MovieCard.displayName = 'MovieCard';
