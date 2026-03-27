"use client";

import { useState, useEffect } from "react";
import BibleVerse from "./BibleVerse";
import ChurchSchedule from "./ChurchSchedule";
import { AnimatePresence, motion } from "framer-motion";

export default function AlternatingDisplay() {
  const [hasContacted, setHasContacted] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkStatus = () => {
      setHasContacted(localStorage.getItem("hasContacted") === "true");
    };
    
    checkStatus();

    // Listen to custom event from VisitorForm
    window.addEventListener("contacted", checkStatus);
    
    return () => window.removeEventListener("contacted", checkStatus);
  }, []);

  useEffect(() => {
    if (!hasContacted) return;

    // Toggle every 10 seconds if they have contacted
    const interval = setInterval(() => {
      setShowSchedule((prev) => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, [hasContacted]);

  return (
    <div className="relative min-h-[250px] w-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {hasContacted && showSchedule ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full absolute"
          >
            <ChurchSchedule />
          </motion.div>
        ) : (
          <motion.div
            key="verse"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full absolute"
          >
            <BibleVerse />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
