import { SkeletonHero, SkeletonRow } from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#03060f]">
      <SkeletonHero />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  );
}
