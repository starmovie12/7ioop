'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AuroraBackground } from '@/components/AuroraBackground';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { MoodFilter } from '@/components/MoodFilter';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { SkeletonRow } from '@/components/SkeletonCard';
import { tmdb, Movie, Genre } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import Link from 'next/link';

export default function MflixHome() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [bollywood, setBollywood] = useState<Movie[]>([]);
  const [bollywoodTop, setBollywoodTop] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [animeTop, setAnimeTop] = useState<Movie[]>([]);
  const [hollywoodTop, setHollywoodTop] = useState<Movie[]>([]);
  const [netflix, setNetflix] = useState<Movie[]>([]);
  const [moodMovies, setMoodMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [visibleGenres, setVisibleGenres] = useState(2);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem('mflix_history') || '[]')); } catch {}
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [trendRes, bollRes, genresRes] = await Promise.all([
          tmdb.getTrending('all', 'week'),
          tmdb.getBollywood(),
          tmdb.getGenres('movie'),
        ]);
        setTrending(trendRes.results);
        setBollywood(bollRes.results);
        setMoodMovies(trendRes.results);
        setGenres(genresRes.genres);
        setLoading(false);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    if (loading) return;
    const load2 = async () => {
      try {
        const [popRes, topRes, bollTopRes, hollyRes, animeRes, netRes] = await Promise.all([
          tmdb.getPopular('movie'), tmdb.getTopRated('movie'),
          tmdb.getBollywoodTopRated(), tmdb.getHollywoodTopRated(),
          tmdb.getAnimeTopRated(), tmdb.getNetflixShows(),
        ]);
        setPopular(popRes.results); setTopRated(topRes.results);
        setBollywoodTop(bollTopRes.results); setHollywoodTop(hollyRes.results);
        setAnimeTop(animeRes.results); setNetflix(netRes.results);
      } catch {}
    };
    load2();
  }, [loading]);

  useEffect(() => {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVisibleGenres(c => Math.min(c + 2, genres.length)); }, { threshold: 0.1 });
    if (bottomRef.current) obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [genres.length]);

  return (
    <main className="relative min-h-screen bg-[#03060f]">
      <AuroraBackground />
      <Navbar />
      <HeroBanner movies={trending.slice(0, 5)} />

      {/* Continue Watching */}
      {history.length > 0 && (
        <div className="py-4 px-4 md:px-8 lg:px-12">
          <h2 className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase italic mb-4">▶ Continue Watching</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {history.slice(0, 10).map((item: any) => (
              <Link key={`${item.id}-${item.type}`} href={`/player/${item.id}?type=${item.type}`}
                className="flex-shrink-0 w-36 md:w-44 rounded-xl overflow-hidden bg-[#1a1f2e] border border-white/5 hover:border-white/20 transition-all group">
                <div className="relative" style={{ aspectRatio: '2/3' }}>
                  {item.poster_path
                    ? <img src={getImageUrl(item.poster_path)} alt={item.title || ''} className="w-full h-full object-cover" />
                    : <div className="w-full h-full shimmer bg-white/10" />}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"><div className="h-full bg-red-600 w-1/3" /></div>
                </div>
                <div className="p-2">
                  <p className="text-white text-xs font-bold line-clamp-1">{item.title || item.name}</p>
                  {item.type === 'tv' && item.season && <p className="text-gray-500 text-[10px]">S{item.season} E{item.episode}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <MoodFilter onMoodChange={setMoodMovies} />
      {moodMovies.length > 0 && <MovieRow title="🎭 Based on Your Mood" movies={moodMovies} />}

      {loading ? (<><SkeletonRow /><SkeletonRow /></>) : (<>
        <MovieRow title="🇮🇳 Top 10 Bollywood" movies={bollywood.slice(0, 10)} isTop10 />
        <MovieRow title="🎬 Top 10 Hollywood" movies={topRated.slice(0, 10)} isTop10 />
        <MovieRow title="🌊 Top 10 Anime" movies={animeTop.slice(0, 10)} isTop10 />
        <MovieRow title="📺 Top 10 Web Series" movies={netflix.slice(0, 10)} isTop10 />
        <MovieRow title="🔥 Top 10 Trending" movies={trending.slice(0, 10)} isTop10 />
      </>)}

      <MovieRow title="🎭 Bollywood Latest Hits" movies={bollywood} />
      <MovieRow title="🎶 South Indian Blockbusters" fetchFn={tmdb.getSouthIndian} />
      <MovieRow title="🌟 Tamil Cinema" fetchFn={tmdb.getTamilMovies} />
      <MovieRow title="⭐ Telugu Blockbusters" fetchFn={tmdb.getTeluguMovies} />
      <MovieRow title="🎵 Punjabi Movies" fetchFn={tmdb.getPunjabiMovies} />
      <MovieRow title="🏆 Malayalam Cinema" fetchFn={tmdb.getMalayalamMovies} />
      <MovieRow title="🌺 Marathi Movies" fetchFn={tmdb.getMarathiMovies} />
      <MovieRow title="🎨 Bengali Cinema" fetchFn={tmdb.getBengaliMovies} />
      <MovieRow title="📱 Indian Web Series" fetchFn={tmdb.getIndianWebSeries} />
      <MovieRow title="🇵🇰 Pakistani Dramas" fetchFn={tmdb.getPakistaniDramas} />
      <MovieRow title="🎌 Anime Series" fetchFn={tmdb.getAnime} />
      <MovieRow title="🇰🇷 K-Dramas" fetchFn={tmdb.getKoreanDramas} />
      <MovieRow title="🇰🇷 Korean Movies" fetchFn={tmdb.getKoreanMovies} />
      <MovieRow title="🎬 Hollywood Popular" movies={popular} />
      <MovieRow title="🏅 Hollywood Top Rated" movies={hollywoodTop} />
      <MovieRow title="🇯🇵 Japanese Movies" fetchFn={tmdb.getJapaneseMovies} />
      <MovieRow title="🇪🇸 Spanish Cinema" fetchFn={tmdb.getSpanishContent} />
      <MovieRow title="🇫🇷 French Cinema" fetchFn={tmdb.getFrenchContent} />
      <MovieRow title="🇹🇷 Turkish Dramas" fetchFn={tmdb.getTurkishContent} />
      <MovieRow title="📺 Netflix Originals" movies={netflix} />
      <MovieRow title="📦 Amazon Originals" fetchFn={tmdb.getAmazonShows} />

      {genres.slice(0, visibleGenres).map(genre => (
        <MovieRow key={genre.id} title={`🎭 ${genre.name}`} genreId={genre.id} type="movie" />
      ))}

      <div ref={bottomRef} className="h-8 flex items-center justify-center">
        {visibleGenres < genres.length && <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />}
      </div>

      <footer className="text-center py-8 text-gray-600 text-xs border-t border-white/5 mt-4">
        <p className="font-black text-red-600 italic text-lg mb-2">MFLIX</p>
        <p>This product uses the TMDB API but is not endorsed by TMDB.</p>
      </footer>
      <BottomNav />
    </main>
  );
}
