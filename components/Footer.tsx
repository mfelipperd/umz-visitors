"use client";

import { Heart, Instagram, MapPin, Clock, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <footer className="bg-primary text-white pt-20 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Church Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-2xl tracking-tight">{t("footerTitle")}</h3>
              <p className="text-blue-100/60 font-light text-sm leading-relaxed">
                {t("footerText")}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/espacontumarizal/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://share.google/Eyq2ZTM012QnTfx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all shadow-lg"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-6 lg:col-span-2">
            <h4 className="font-bold text-lg flex items-center gap-2 text-accent">
              <Clock className="w-5 h-5" />
              Nossos Cultos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-accent/30 transition-colors">
                <p className="text-accent font-bold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Sabados
                </p>
                <ul className="text-sm space-y-2 text-blue-100/80">
                  <li className="flex justify-between">
                    <span>Escola Sabatina</span>
                    <span className="font-medium">09:00 - 10:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Culto Divino</span>
                    <span className="font-medium">10:00 - 12:00</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-accent/30 transition-colors">
                <p className="text-accent font-bold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Domingos
                </p>
                <ul className="text-sm space-y-2 text-blue-100/80">
                  <li className="flex justify-between">
                    <span>Culto de Esperança</span>
                    <span className="font-medium">19:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Location / Action */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-accent">Onde Estamos</h4>
              <p className="text-sm text-blue-100/60 font-light">
                Espaço Novo Tempo Umarizal<br />
                Belem, Pará
              </p>
              <Button 
                variant="accent" 
                className="w-full mt-2 gap-2"
                onClick={() => router.push("/como-chegar")}
              >
                <MapPin className="w-4 h-4" />
                Como Chegar
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
                <Heart className="text-accent fill-accent w-5 h-5" />
                <span className="text-[6px] font-bold uppercase mt-1 tracking-widest">Youth</span>
              </div>
              <div className="text-[10px] text-blue-100/30 uppercase tracking-[0.2em] font-bold">
                Ministry
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-100/20 text-xs font-light">
            &copy; {new Date().getFullYear()} Umz Visitors Project. Todos os direitos reservados.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] text-blue-100/40 uppercase tracking-widest font-bold">
              Criado com ❤️ por <a href="https://mfelippe.com.br" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline decoration-accent/30 underline-offset-4">Marcos Felippe</a>
            </p>
            <div className="flex gap-6 text-[10px] text-blue-100/40 uppercase tracking-widest font-bold">
              <a href="#" className="hover:text-accent transition-colors">Privacidade</a>
              <a href="#" className="hover:text-accent transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
