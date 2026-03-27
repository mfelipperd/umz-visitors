"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Você é o convidado de honra de Deus hoje.",
  "Nossa família está mais completa com a sua presença.",
  "Há um lugar reservado para você em nosso banco.",
  "Deus sorri ao ver você aqui.",
  "Sua jornada importa para nós."
];

export default function AffectionMessage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center pt-6 border-t border-gray-50 h-12 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1 }}
          className="text-md text-gray-400 italic font-light text-center"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
