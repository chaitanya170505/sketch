"use client";

export default function Footer() {
  return (
    <footer className="h-10 w-full bg-white/80 backdrop-blur-md border-t border-green-50 flex items-center justify-between px-8 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[9px] font-black text-green-900/40 uppercase tracking-[0.3em]">
          Studio Engine Active
        </span>
      </div>
      
      <p className="text-[10px] text-green-900/30 font-bold uppercase tracking-widest">
        Manorekha Digital Canvas — v2.0
      </p>

      <div className="text-[9px] text-green-900/40 font-bold uppercase">
        Built with React & Konva
      </div>
    </footer>
  );
}