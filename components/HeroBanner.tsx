'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Volume2, VolumeX, Star } from 'lucide-react';
import { tmdb, getImageUrl, Movie } from '@/lib/tmdb';

interface HeroBannerProps {
  movies?: Movie[];
}

export const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadHero = async () => {
      try {
        let topMovie: Movie;
        if (movies && movies.length > 0) {
          topMovie = movies[0];
        } else {
          const trending = await tmdb.getTrending('movie', 'day');
          topMovie = trending.results[0];
        }
        setMovie(topMovie);
        requestAnimationFrame(() => setTimeout(() => setVisible(true), 50));

        const videos = await tmdb.getVideos('movie', topMovie.id);
        const trailer = videos.results.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        if (trailer) setTrailerId(trailer.key);
      } catch {}
    };
    loadHero();
  }, [movies]);

  if (!movie) return <div className="h-[85vh] w-full shimmer bg-white/5" />;

  const mediaType = movie.media_type || 'movie';
  const href = `/player/${movie.id}?type=${mediaType}`;
  const year = new Date(movie.release_date || movie.first_air_date || '').getFullYear();

  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {trailerId ? (
          <div className="relative w-full h-full scale-110">
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerId}&showinfo=0&rel=0`}
              className="w-full h-full pointer-events-none"
              allow="autoplay; encrypted-media"
              title="Hero Trailer"
            />
          </div>
        ) : (
          <Image
            src={getImageUrl(movie.backdrop_path, 'backdrop')}
            alt={movie.title || movie.name || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03060f] via-[#03060f]/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03060f]/80 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end pb-28 md:pb-20 px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div
          className="max-w-2xl transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-red-600 text-white">MFLIX</span>
            {year > 1900 && <span className="text-gray-400 text-sm">{year}</span>}
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <Star size={12} fill="currentColor" /> {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tighter text-white uppercase italic drop-shadow-2xl leading-none">
            {movie.title || movie.name}
          </h1>
          <p className="text-sm md:text-base text-gray-200 mb-8 line-clamp-3 leading-relaxed max-w-xl">
            {movie.overview}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={href}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl text-sm"
            >
              <Play className="fill-current" size={18} /> Watch Now
            </Link>
            <Link
              href={href}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10 shadow-xl text-sm"
            >
              <Info size={18} /> More Info
            </Link>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="ml-auto p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-black/50 transition-all"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
