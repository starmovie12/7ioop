'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { MovieRow } from '@/components/MovieRow';
import { tmdb } from '@/lib/tmdb';

export default function AnimePage() {
  return (
    <div className="min-h-screen bg-[#03060f]">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="px-4 md:px-8 lg:px-12 mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">🎌 Anime</h1>
          <p className="text-gray-400 mt-2">Best anime series and movies from Japan</p>
        </div>
        <MovieRow title="🔥 Trending Anime" fetchFn={tmdb.getAnime} />
        <MovieRow title="🏆 Top Rated Anime" fetchFn={tmdb.getAnimeTopRated} />
        <MovieRow title="🎬 Anime Movies" fetchFn={tmdb.getAnimeMovies} />
        <MovieRow title="🇯🇵 Japanese Cinema" fetchFn={tmdb.getJapaneseMovies} />
      </div>
      <BottomNav />
    </div>
  );
}
