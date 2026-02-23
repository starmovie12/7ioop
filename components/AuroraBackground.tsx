'use client';

export const AuroraBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#03060f]">
    <div className="aurora1 absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px]" />
    <div className="aurora2 absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[100px]" />
    <div className="aurora3 absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/15 blur-[110px]" />
  </div>
);
