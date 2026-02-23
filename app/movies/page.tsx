'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { MovieCard } from '@/components/MovieCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { tmdb, Genre } from '@/lib/tmdb';
import { Loader2 } from 'lucide-react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    tmdb.getGenres('movie').then((r: any) => setGenres(r.genres)).catch(() => {});
  }, []);

  const fetchMovies = useCallback(async (p = 1, reset = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true; setLoading(true);
    try {
      let res;
      if (selectedGenres.length > 0) res = await tmdb.discoverByGenre('movie', selectedGenres.join(','), p);
      else res = await tmdb.getPopular('movie', p);
      if (reset) setMovies(res.results);
      else setMovies((prev: any[]) => [...prev, ...res.results]);
      setPage(p); setHasMore(res.results.length > 0 && p < 10);
    } catch {}
    finally { setLoading(false); fetchingRef.current = false; }
  }, [selectedGenres]);

  useEffect(() => { fetchMovies(1, true); }, [fetchMovies]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      e => { if (e[0].isIntersecting && hasMore) fetchMovies(page + 1); },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [fetchMovies, hasMore, page]);

  const toggleGenre = (id: number) =>
    setSelectedGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-[#03060f]">
      <Navbar />
      <div className="px-4 md:px-8 lg:px-12 pt-24 pb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-6">🎬 Movies</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {genres.map(g => (
            <button key={g.id} onClick={() => toggleGenre(g.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedGenres.includes(g.id) ? 'bg-red-600 text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}>
              {g.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((m: any, i: number) => <MovieCard key={`${m.id}-${i}`} movie={m} index={i} />)}
          {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div ref={sentinelRef} className="h-8 flex items-center justify-center mt-4">
          {loading && movies.length > 0 && <Loader2 className="text-red-600 animate-spin" />}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
