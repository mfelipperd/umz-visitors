"use client";

import { useState } from "react";

import Footer from "@/components/Footer";
import AlternatingDisplay from "@/components/AlternatingDisplay";
import AffectionMessage from "@/components/AffectionMessage";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import VisitorForm from "@/components/VisitorForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function VisitantesContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const handleVisitClick = () => {
    if (window.innerWidth < 640) {
      router.push("/visita");
    } else {
      setOpen(true);
    }
  };

  return (
    <main className="min-h-screen pt-24 px-6 max-w-4xl mx-auto space-y-16 pb-24">
      {/* Bible Verse Section - THE MAIN FOCUS */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-[300px] flex flex-col justify-center">
        <AlternatingDisplay />
        <AffectionMessage />
      </section>

      {/* Welcome Message - MORE SUBTLE */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center space-y-8 py-4"
      >
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-medium text-primary/60 tracking-tight">
            {t("heroTitle")}
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto leading-relaxed text-sm font-light">
            {t("heroSubtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 pt-4">
          <Button 
            onClick={handleVisitClick}
            size="lg" 
            variant="accent" 
            className="h-16 px-12 text-xl font-bold rounded-2xl shadow-xl shadow-accent/20 group w-full sm:w-auto"
          >
            <MapPin className="w-6 h-6 mr-2 group-hover:animate-bounce" />
            Quero Visitar a Igreja
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
              {/* Premium Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
              
              <div className="bg-primary p-6 text-white relative z-10 overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                    <MapPin className="w-5 h-5 text-accent shrink-0" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight leading-none mb-1">Seja bem-vindo!</DialogTitle>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Espaço Umarizal</p>
                  </div>
                </div>
              </div>
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-6 bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", step === 1 ? "bg-accent" : "bg-gray-200")} />
                  <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", step === 2 ? "bg-accent" : "bg-gray-200")} />
                </div>
                <VisitorForm onStepChange={setStep} />
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => router.push("/como-chegar")}
            variant="ghost"
            className="text-primary/60 hover:text-primary hover:bg-primary/5 gap-2"
          >
            <Navigation className="w-4 h-4" />
            Ver Localização e Como Chegar
          </Button>

          <p className="text-sm text-gray-400 font-light max-w-xs text-center">
            Ao clicar em "Quero Visitar", você será conectado a um de nossos membros que te guiará em sua primeira visita.
          </p>
        </div>
      </motion.section>

      {/* Decorative separator */}
      <div className="flex justify-center py-12">
        <div className="w-24 h-1 bg-accent/20 rounded-full" />
      </div>
    </main>
  );
}

export default function VisitantesPage() {
  return (
    <LanguageProvider>
      <div className="relative overflow-hidden selection:bg-accent selection:text-primary min-h-screen">
        <div className="fixed top-0 left-0 pl-6 pt-6 z-50 pointer-events-none">
          <div className="pointer-events-auto bg-white/60 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-black/5 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
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
        
        <VisitantesContent />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
