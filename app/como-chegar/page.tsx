"use client";

import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Navigation } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ComoChegarContent() {
  return (
    <main className="min-h-screen pt-24 px-6 max-w-4xl mx-auto space-y-12 pb-24">
      <div className="flex items-center justify-between">
        <Link 
          href="/visitantes" 
          className="inline-flex items-center text-primary/60 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para Visitantes
        </Link>
      </div>

      <header className="space-y-4 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Nossa Localização</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          R. Domingos Marreiros, 1374 - Umarizal, Belém - PA. Estamos de portas abertas para te receber.
        </p>
      </header>

      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-gray-100 bg-white p-3"
      >
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.557472979444!2d-48.48232032526189!3d-1.4404684985459595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48ea746abf53b%3A0x7ba839bf573d00ed!2sEspa%C3%A7o%20Novo%20Tempo%20Umarizal!5e0!3m2!1spt-BR!2sbr!4v1774643975027!5m2!1spt-BR!2sbr" 
          width="100%" 
          height="500" 
          style={{ border: 0, borderRadius: '30px' }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          variant="outline"
          className="h-14 rounded-2xl gap-3 border-gray-200 hover:bg-black hover:text-white transition-all group"
          onClick={() => window.open("https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=-1.440468&dropoff[longitude]=-48.482320&dropoff[nickname]=Espaço%20Novo%20Tempo%20Umarizal", "_blank")}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" className="h-4 w-auto brightness-0 group-hover:brightness-100 invert-0 group-hover:invert transition-all" />
          Ir de Uber
        </Button>
        <Button 
          variant="outline"
          className="h-14 rounded-2xl gap-3 border-gray-200 hover:bg-[#FFD300] hover:text-black transition-all group"
          onClick={() => window.open("https://99app.com/share?dest_lat=-1.440468&dest_lng=-48.482320", "_blank")}
        >
          <span className="font-black italic text-xl">99</span>
          Ir de 99
        </Button>
        <Button 
          variant="outline"
          className="h-14 rounded-2xl gap-3 border-gray-200 hover:bg-[#33CCFF] hover:text-white transition-all group"
          onClick={() => window.open("https://waze.com/ul?ll=-1.440468,-48.482320&navigate=yes", "_blank")}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Waze_logo.svg/1024px-Waze_logo.svg.png" alt="Waze" className="h-6 w-auto transition-all" />
          Ir de Waze
        </Button>
        <Button 
          variant="accent"
          className="h-14 rounded-2xl gap-2 font-bold shadow-lg shadow-accent/20"
          asChild
        >
          <Link href="/visita">
            Agendar Visita
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default function ComoChegarPage() {
  return (
    <LanguageProvider>
      <div className="relative overflow-hidden selection:bg-accent selection:text-primary min-h-screen">
        <HomeHeader />
        <ComoChegarContent />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

function HomeHeader() {
  return (
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
  );
}
