'use client';

export const SkeletonCard = () => (
  <div className="w-full">
    <div className="w-full rounded-2xl overflow-hidden relative bg-[#1a1f2e]" style={{ aspectRatio: '2/3' }}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-[#252b3b] to-[#1a1f2e]" />
      <div className="absolute inset-0 skeleton-sweep" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
      </div>
      <div className="absolute top-2 left-2 h-4 w-12 rounded-lg bg-white/5 animate-pulse" />
    </div>
    <div className="mt-2 space-y-1.5 px-0.5">
      <div className="h-3 rounded-full bg-[#252b3b] animate-pulse w-4/5" />
      <div className="flex gap-2">
        <div className="h-2.5 rounded-full bg-[#252b3b] animate-pulse w-8" />
        <div className="h-2.5 rounded-full bg-[#252b3b] animate-pulse w-10" />
      </div>
    </div>
  </div>
);

export const SkeletonRow = ({ count = 6 }: { count?: number }) => (
  <div className="py-4 md:py-8 px-4 md:px-8 lg:px-12">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-6 w-4 rounded bg-[#252b3b] animate-pulse" />
      <div className="h-6 rounded-xl bg-[#252b3b] animate-pulse w-48" />
    </div>
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="min-w-[28.5%] md:min-w-[20%] lg:min-w-[16.66%] xl:min-w-[12.5%] flex-shrink-0" style={{ opacity: 1 - i * 0.1 }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonHero = () => (
  <div className="relative w-full bg-[#0d1117]" style={{ height: '85vh' }}>
    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#1a1f2e] to-[#03060f]" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#03060f] to-transparent" />
    <div className="absolute bottom-28 left-4 md:left-12 space-y-4 max-w-xl">
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-lg bg-red-900/50 animate-pulse" />
        <div className="h-5 w-20 rounded-lg bg-white/5 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-10 md:h-14 w-72 md:w-96 rounded-2xl bg-white/10 animate-pulse" />
        <div className="h-10 md:h-14 w-52 md:w-72 rounded-2xl bg-white/5 animate-pulse" />
      </div>
      <div className="h-4 w-full max-w-md rounded-full bg-white/5 animate-pulse" />
      <div className="h-4 w-3/4 rounded-full bg-white/5 animate-pulse" />
      <div className="flex gap-3 mt-6">
        <div className="h-12 w-32 rounded-xl bg-white/20 animate-pulse" />
        <div className="h-12 w-36 rounded-xl bg-white/10 animate-pulse" />
      </div>
    </div>
  </div>
);

export const SkeletonDetail = () => (
  <div className="min-h-screen bg-[#03060f]">
    <div className="relative" style={{ minHeight: '70vh' }}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#1a1f2e] to-[#03060f]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03060f] to-transparent" />
      <div className="relative z-10 flex flex-col md:flex-row gap-8 px-4 md:px-12 pt-20 pb-12">
        <div className="flex-1 max-w-2xl space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-14 rounded-lg bg-red-900/50 animate-pulse" />
            <div className="h-5 w-20 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="h-14 w-3/4 rounded-2xl bg-white/10 animate-pulse" />
          <div className="h-14 w-1/2 rounded-2xl bg-white/5 animate-pulse" />
          <div className="flex gap-4">
            {[1,2,3].map(i => <div key={i} className="h-4 w-16 rounded-full bg-white/10 animate-pulse" />)}
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-white/5 animate-pulse" />
            <div className="h-3 w-5/6 rounded-full bg-white/5 animate-pulse" />
            <div className="h-3 w-4/6 rounded-full bg-white/5 animate-pulse" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-12 w-36 rounded-xl bg-white/20 animate-pulse" />
            <div className="h-12 w-32 rounded-xl bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="hidden md:block w-48 lg:w-56">
          <div className="rounded-2xl bg-[#1a1f2e] animate-pulse" style={{ aspectRatio: '2/3' }} />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 18 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-8 lg:px-12 pt-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);
