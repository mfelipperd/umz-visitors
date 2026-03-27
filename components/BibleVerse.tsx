"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface Verse {
  text: string;
  ref: string;
}

export default function BibleVerse() {
  const { t } = useLanguage();
  const [verse, setVerse] = useState<Verse | null>(null);

  useEffect(() => {
    const welcomingVerses = [
      { text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", ref: "Mateus 11:28" },
      { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", ref: "Jeremias 29:11" },
      { text: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda paz.", ref: "Números 6:24-26" },
      { text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.", ref: "1 Pedro 5:7" },
      { text: "Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbe o seu coração, nem tenham medo.", ref: "João 14:27" },
      { text: "Como é bom e agradável quando os irmãos convivem em união!", ref: "Salmos 133:1" },
      { text: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.", ref: "Efésios 4:32" },
      { text: "Aproximem-se de Deus, e ele se aproximará de vocês.", ref: "Tiago 4:8" },
      { text: "O Senhor é a minha luz e a minha salvação; de quem terei temor? O Senhor é o meu forte refúgio; de quem terei medo?", ref: "Salmos 27:1" },
      { text: "Pois onde se reunirem dois ou três em meu nome, ali eu estou no meio deles.", ref: "Mateus 18:20" }
    ];
    
    // Choose a random verse once on component mount
    const randomVerse = welcomingVerses[Math.floor(Math.random() * welcomingVerses.length)];
    setVerse(randomVerse);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center text-center space-y-4 py-8"
    >
      <Quote className="text-accent w-8 h-8 opacity-50" />
      <AnimatePresence mode="wait">
        {verse ? (
          <motion.div
            key={verse.ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <p className="text-2xl md:text-4xl font-light text-primary tracking-tight leading-tight px-4">
              "{verse.text}"
            </p>
            <span className="block text-primary/60 font-medium text-lg italic uppercase tracking-widest">
              — {verse.ref}
            </span>
          </motion.div>
        ) : (
          <p className="text-gray-400 italic font-light">{t("waitBible")}</p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
