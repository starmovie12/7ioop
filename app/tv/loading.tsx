import { SkeletonGrid } from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#03060f] pt-24">
      <div className="px-4 md:px-8 lg:px-12 mb-6">
        <div className="h-10 w-40 rounded-2xl bg-[#1a1f2e] animate-pulse mb-4" />
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-9 w-20 rounded-xl bg-[#1a1f2e] animate-pulse" />
          ))}
        </div>
      </div>
      <SkeletonGrid count={18} />
    </div>
  );
}
