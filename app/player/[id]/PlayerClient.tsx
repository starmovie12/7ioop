'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Heart, Share2, Star, Clock, Calendar, CheckCircle } from 'lucide-react';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { MovieRow } from '@/components/MovieRow';
import { BottomNav } from '@/components/BottomNav';
import { useToast } from '@/components/Toast';

interface PlayerClientProps {
  id: number;
  type: 'movie' | 'tv';
}

export default function PlayerClient({ id, type }: PlayerClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'more'>('overview');
  const [userRating, setUserRating] = useState(0);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = type === 'tv'
          ? await tmdb.getTVDetails(id)
          : await tmdb.getMovieDetails(id);
        setDetails(data);
        try {
          const history = JSON.parse(localStorage.getItem('mflix_history') || '[]');
          const item = { id, type, title: data.title || data.name, poster_path: data.poster_path, timestamp: Date.now() };
          const filtered = history.filter((h: any) => !(h.id === id && h.type === type));
          localStorage.setItem('mflix_history', JSON.stringify([item, ...filtered].slice(0, 50)));
          const wl = JSON.parse(localStorage.getItem('mflix_watchlist') || '[]');
          setInWatchlist(wl.some((w: any) => w.id === id && w.type === type));
          const ratings = JSON.parse(localStorage.getItem('mflix_ratings') || '{}');
          setUserRating(ratings[`${type}_${id}`] || 0);
        } catch {}
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [id, type]);

  const toggleWatchlist = () => {
    try {
      const wl = JSON.parse(localStorage.getItem('mflix_watchlist') || '[]');
      if (inWatchlist) {
        localStorage.setItem('mflix_watchlist', JSON.stringify(wl.filter((w: any) => !(w.id === id && w.type === type))));
        setInWatchlist(false);
        showToast('Removed from watchlist', 'info');
      } else {
        const item = { id, type, title: details?.title || details?.name, poster_path: details?.poster_path, timestamp: Date.now() };
        localStorage.setItem('mflix_watchlist', JSON.stringify([item, ...wl]));
        setInWatchlist(true);
        showToast('Added to watchlist ❤️', 'success');
      }
    } catch {}
  };

  const handleRate = (rating: number) => {
    setUserRating(rating);
    try {
      const ratings = JSON.parse(localStorage.getItem('mflix_ratings') || '{}');
      ratings[`${type}_${id}`] = rating;
      localStorage.setItem('mflix_ratings', JSON.stringify(ratings));
      showToast(`Rated ${rating}/5 ⭐`, 'success');
    } catch {}
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) navigator.share({ title: details?.title || details?.name, url });
    else { navigator.clipboard.writeText(url); showToast('Link copied! 🔗', 'success'); }
    setShowShare(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!details) return (
    <div className="min-h-screen bg-[#03060f] flex items-center justify-center">
      <p className="text-white">Content not found</p>
    </div>
  );

  const title = details.title || details.name;
  const year = new Date(details.release_date || details.first_air_date || '').getFullYear();
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const cast = details.credits?.cast?.slice(0, 12) || [];
  const director = details.credits?.crew?.find((c: any) => c.job === 'Director');
  const similar = details.similar?.results || [];
  const recommendations = details.recommendations?.results || [];

  return (
    <div className="min-h-screen bg-[#03060f]">
      {showPlayer && (
        <VideoPlayer id={id} type={type} title={title} onClose={() => setShowPlayer(false)} />
      )}

      {/* Hero */}
      <div className="relative" style={{ minHeight: '70vh' }}>
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(details.backdrop_path, 'backdrop')}
            alt={title} fill className="object-cover" priority sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#03060f] via-[#03060f]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03060f] via-[#03060f]/20 to-transparent" />
        </div>

        <button onClick={() => router.back()}
          className="absolute top-6 left-4 md:left-8 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
          <ArrowLeft size={20} />
        </button>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 px-4 md:px-12 pt-20 pb-12">
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-red-600 text-white">MFLIX</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-white uppercase">
                {type === 'tv' ? 'SERIES' : 'MOVIE'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic text-white mb-4 leading-none">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {details.vote_average > 0 && (
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star size={16} fill="currentColor" /> {details.vote_average.toFixed(1)}
                </div>
              )}
              {year > 1900 && <div className="flex items-center gap-1 text-gray-300"><Calendar size={14} /> {year}</div>}
              {runtime && <div className="flex items-center gap-1 text-gray-300"><Clock size={14} /> {runtime}</div>}
              <span className="text-gray-400 font-black border border-white/10 px-2 py-0.5 rounded-lg text-[11px]">4K HDR</span>
            </div>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-4">{details.overview}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => setShowPlayer(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black hover:scale-105 active:scale-95 transition-all text-sm">
                <Play size={18} fill="currentColor" /> Watch Now
              </button>
              <button onClick={toggleWatchlist}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 ${inWatchlist ? 'bg-red-600 text-white' : 'bg-white/10 border border-white/10 text-white hover:bg-white/20'}`}>
                {inWatchlist ? <CheckCircle size={18} /> : <Heart size={18} />}
                {inWatchlist ? 'Saved' : '+ Watchlist'}
              </button>
              <div className="relative">
                <button onClick={() => setShowShare(!showShare)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                  <Share2 size={18} />
                </button>
                {showShare && (
                  <div className="absolute top-full left-0 mt-2 bg-[#1a1f2e] border border-white/10 rounded-2xl p-2 z-20 min-w-[160px] shadow-2xl">
                    <button onClick={handleShare} className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-xl">🔗 Copy Link</button>
                    <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                      target="_blank" rel="noreferrer" className="block px-3 py-2 text-sm text-white hover:bg-white/10 rounded-xl">💬 WhatsApp</a>
                    <a href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank" rel="noreferrer" className="block px-3 py-2 text-sm text-white hover:bg-white/10 rounded-xl">✈️ Telegram</a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Rate:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => handleRate(star)}
                  className={`text-xl transition-all hover:scale-125 ${star <= userRating ? 'text-yellow-400' : 'text-gray-600'}`}>★</button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-48 lg:w-56 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ aspectRatio: '2/3' }}>
              <Image src={getImageUrl(details.poster_path)} alt={title} fill className="object-cover" sizes="224px" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-12 mb-6">
        <div className="flex gap-2 border-b border-white/10">
          {(['overview', 'cast', 'more'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold capitalize transition-all border-b-2 -mb-0.5 ${activeTab === tab ? 'border-red-600 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-12 mb-12">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">{details.overview}</p>
            <div className="flex flex-wrap gap-2">
              {details.genres?.map((g: any) => (
                <Link key={g.id} href={`/genre/${g.id}`}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-all">
                  {g.name}
                </Link>
              ))}
            </div>
            {director && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                  {director.profile_path
                    ? <Image src={getImageUrl(director.profile_path, 'profile')} alt={director.name} width={48} height={48} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center text-white font-black">{director.name[0]}</div>}
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Director</p>
                  <p className="text-white font-bold">{director.name}</p>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'cast' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {cast.map((c: any) => (
              <Link key={c.id} href={`/person/${c.id}`} className="group text-center">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-white/10 mb-2">
                  {c.profile_path
                    ? <Image src={getImageUrl(c.profile_path, 'profile')} alt={c.name} width={64} height={64} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center text-white font-black">{c.name[0]}</div>}
                </div>
                <p className="text-white text-xs font-bold line-clamp-1">{c.name}</p>
                <p className="text-gray-500 text-[10px] line-clamp-1">{c.character}</p>
              </Link>
            ))}
          </div>
        )}
        {activeTab === 'more' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              ['Status', details.status],
              ['Language', details.original_language?.toUpperCase()],
              ['Budget', details.budget ? `$${(details.budget / 1e6).toFixed(1)}M` : null],
              ['Revenue', details.revenue ? `$${(details.revenue / 1e6).toFixed(1)}M` : null],
              ['Tagline', details.tagline],
              ['Studio', details.production_companies?.[0]?.name],
            ].filter(([, v]) => v).map(([l, v]) => (
              <div key={l as string} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-gray-500 text-xs mb-1">{l}</p>
                <p className="text-white font-bold text-sm">{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {similar.length > 0 && <MovieRow title="🎬 More Like This" movies={similar} />}
      {recommendations.length > 0 && <MovieRow title="💡 You Might Also Like" movies={recommendations} />}
      <BottomNav />
    </div>
  );
}
