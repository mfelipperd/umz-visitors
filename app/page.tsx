"use client";

import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Construction, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

function HomeContent() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 max-w-4xl mx-auto text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center mb-4"
      >
        <Sparkles className="w-12 h-12 text-accent animate-pulse" />
      </motion.div>

      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight leading-tight">
          Algo <span className="text-accent">especial</span> está sendo <br /> preparado para você.
        </h1>
        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
          O novo site do <strong>Espaço Novo Tempo Umarizal</strong> está ganhando vida. 
          Em breve, teremos uma experiência completa de acolhimento aqui.
        </p>
      </div>

      <div className="flex items-center gap-2 text-primary/40 font-medium bg-primary/5 px-6 py-3 rounded-2xl border border-primary/5">
        <Construction className="w-5 h-5" />
        <span>Site em construção</span>
      </div>

      <div className="pt-8 space-y-4">
        <p className="text-sm text-gray-400 italic flex items-center justify-center gap-2">
           Enquanto isso, você ainda pode agendar sua visita:
        </p>
        <Link 
          href="/visitantes" 
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
        >
          Quero Visitar a Igreja
        </Link>
      </div>

      <div className="pt-12 flex items-center justify-center gap-8 opacity-40">
        <div className="flex flex-col items-center">
          <Heart className="w-6 h-6 text-red-400 mb-1" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Acolhimento</span>
        </div>
        <div className="flex flex-col items-center">
          <Sparkles className="w-6 h-6 text-accent mb-1" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Inovação</span>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <div className="relative overflow-hidden selection:bg-accent selection:text-primary min-h-screen flex flex-col justify-between">
        <div className="fixed top-0 left-0 pl-6 pt-6 z-50 pointer-events-none">
          <div className="pointer-events-auto bg-white/60 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-black/5">
            <div className="h-14 md:h-16 flex items-center justify-center p-1">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH6W6SrWYdcFvHr8bZACcEg3swkioidWunUw&s" 
                alt="Logo IASD" 
                className="h-full w-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent opacity-[0.03] rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary opacity-[0.02] rounded-full blur-[120px] -z-10 translate-y-1/2 -translate-x-1/2" />
        
        <HomeContent />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
