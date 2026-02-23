'use client';

import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { MovieRow } from '@/components/MovieRow';
import { tmdb } from '@/lib/tmdb';

export default function PopularPage() {
  return (
    <div className="min-h-screen bg-[#03060f]">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="px-4 md:px-8 lg:px-12 mb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">🔥 New & Popular</h1>
          <p className="text-gray-400 mt-2">Trending and most watched content right now</p>
        </div>
        <MovieRow title="🔥 Trending Today" type="trending" />
        <MovieRow title="🎬 Popular Movies" type="movie" />
        <MovieRow title="📺 Popular TV Shows" type="tv" />
        <MovieRow title="🏅 Top Rated Movies" fetchFn={(p) => tmdb.getTopRated('movie', p)} />
        <MovieRow title="🎌 Trending Anime" fetchFn={tmdb.getAnime} />
        <MovieRow title="🇰🇷 Popular K-Dramas" fetchFn={tmdb.getKoreanDramas} />
      </div>
      <BottomNav />
    </div>
  );
}
