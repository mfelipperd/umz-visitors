"use client";

import { Cross, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xs p-1 text-center">
          IASD
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-primary font-bold text-lg uppercase tracking-tight">Umz Visitors</span>
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary shadow-md">
          <Cross className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
