'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Shuffle, Settings, User } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSurprise = useCallback(async () => {
    try {
      const res = await tmdb.getTrending('all', 'week');
      const items = res.results;
      const pick = items[Math.floor(Math.random() * items.length)];
      const type = pick.media_type || (pick.name && !pick.title ? 'tv' : 'movie');
      router.push(`/player/${pick.id}?type=${type}`);
    } catch {}
  }, [router]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/tv' },
    { name: 'Anime', href: '/anime' },
    { name: 'Popular', href: '/popular' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center gap-4 md:gap-10">
        <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-red-600 italic hover:scale-105 transition-transform">
          MFLIX
        </Link>
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-bold text-gray-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 px-2 transition-colors hover:text-white ${isActive ? 'text-white' : ''}`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={handleSurprise}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/20 transition-all"
          title="Surprise Me"
        >
          <Shuffle size={14} /> <span className="hidden md:inline">Surprise Me</span>
        </button>
        <Link href="/search" className="p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
          <Search size={20} />
        </Link>
        <Link href="/settings" className="p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
          <Settings size={20} />
        </Link>
        <Link href="/profile" className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center hover:ring-2 hover:ring-white/20 transition-all">
          <User size={16} className="text-white" />
        </Link>
      </div>
    </nav>
  );
};
