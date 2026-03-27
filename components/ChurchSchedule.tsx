"use client";

import { motion } from "framer-motion";
import { Clock, CalendarDays } from "lucide-react";

export default function ChurchSchedule() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center text-center space-y-6 py-8 w-full"
    >
      <div className="flex items-center gap-3 text-primary mb-2">
        <CalendarDays className="w-8 h-8 opacity-80" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Nossos Encontros</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-primary/20 transition-all text-left">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <h3 className="font-bold text-primary text-xl mb-1">Sábado</h3>
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4 text-accent" />
              <span className="font-semibold w-12 text-sm">09:00</span>
              <span className="font-medium text-sm">Escola Sabatina</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4 text-accent" />
              <span className="font-semibold w-12 text-sm">10:00</span>
              <span className="font-medium text-sm">Culto de Adoração</span>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-accent/30 transition-all text-left">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <h3 className="font-bold text-primary text-xl mb-1">Domingo</h3>
          <div className="space-y-3 mt-4">
             <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4 text-primary/60" />
              <span className="font-semibold w-12 text-sm">19:00</span>
              <span className="font-medium text-sm">Culto de Louvor</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
