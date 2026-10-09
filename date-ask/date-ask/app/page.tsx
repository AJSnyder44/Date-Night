"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "@/components/Background";
import Celebration from "@/components/Celebration";
import DateForm from "@/components/DateForm";
import NoButton from "@/components/NoButton";
import Wheel from "@/components/Wheel";
import { DateIdea } from "@/lib/dates";

type Step = "ask" | "celebrate" | "wheel" | "schedule";

export default function Home() {
  const [step, setStep] = useState<Step>("ask");
  const [escapes, setEscapes] = useState(0);
  const [idea, setIdea] = useState<DateIdea | null>(null);

  useEffect(() => {
    if (step !== "celebrate") return;
    const t = setTimeout(() => setStep("wheel"), 1800);
    return () => clearTimeout(t);
  }, [step]);

  const yesScale = 1 + Math.min(escapes, 8) * 0.06;
  const asking = step === "ask" || step === "celebrate";

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-10 text-center">
      <Background />
      <AnimatePresence mode="wait">
        {asking && (
          <motion.section key="ask" exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="mb-6 text-6xl sm:text-7xl"
              aria-hidden
            >
              💌
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
            >
              Will you go on a date with me? ❤️
            </motion.h1>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <motion.button
                type="button"
                onClick={() => setStep("celebrate")}
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.06 }}
                whileTap={{ scale: yesScale * 0.95 }}
                className="h-14 w-36 rounded-full bg-gradient-to-r from-rose to-peach text-lg font-bold text-wine shadow-lg shadow-rose/50"
              >
                YES ❤️
              </motion.button>
              <NoButton onEscape={() => setEscapes((n) => n + 1)} />
            </div>
          </motion.section>
        )}
        {step === "wheel" && (
          <motion.div key="wheel" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Wheel
              onConfirm={(i) => {
                setIdea(i);
                setStep("schedule");
              }}
            />
          </motion.div>
        )}
        {step === "schedule" && idea && <DateForm key="schedule" idea={idea} />}
      </AnimatePresence>
      {step === "celebrate" && <Celebration />}
    </main>
  );
}
