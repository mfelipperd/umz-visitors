"use client";

import VisitorForm from "@/components/VisitorForm";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

function VisitaContent() {
  const { t } = useLanguage();
  const router = useRouter();

  // Removed automatic redirect to allow multiple visits/testing
  // useEffect(() => {
  //   if (localStorage.getItem("hasContacted") === "true") {
  //     router.push("/visitantes");
  //   }
  // }, [router]);

  return (
    <div className="min-h-screen bg-white sm:bg-gray-50/30 flex flex-col items-center justify-start sm:justify-center selection:bg-accent selection:text-primary">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full sm:max-w-lg bg-white sm:rounded-[2.5rem] sm:shadow-xl sm:shadow-primary/5 sm:border sm:border-primary/5 overflow-hidden min-h-screen sm:min-h-0"
      >
        {/* Header Section */}
        <div className="bg-primary p-8 sm:p-10 text-white relative rounded-b-[2rem] sm:rounded-none">
          <Link href="/visitantes" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Voltar aos Visitantes</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <MapPin className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Seja bem-vindo!</h1>
          </div>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-sm mt-3">
            Preencha os dados abaixo para que possamos te receber da melhor forma.
          </p>
          
          {/* Decorative Circle */}
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Form Section */}
        <div className="p-8 sm:p-10 bg-white">
          <VisitorForm />
        </div>
      </motion.div>
    </div>
  );
}

export default function VisitaPage() {
  return (
    <LanguageProvider>
      <VisitaContent />
    </LanguageProvider>
  );
}
