"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DATE_IDEAS, DateIdea } from "@/lib/dates";

const N = DATE_IDEAS.length;
const STEP = 360 / N;
const COLORS = ["#FF4D79", "#FFB38A", "#FFD6E0", "#FF8FAB", "#FFC2A1"];
const C = 200;
const R = 190;

function point(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) };
}

function wedge(i: number) {
  const s = point(i * STEP, R);
  const e = point((i + 1) * STEP, R);
  return `M ${C} ${C} L ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y} Z`;
}

export default function Wheel({ onConfirm }: { onConfirm: (idea: DateIdea) => void }) {
  const reduce = useReducedMotion();
  const rotation = useRef(0);
  const target = useRef(0);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<DateIdea | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  function spin() {
    if (spinning) return;
    const index = Math.floor(Math.random() * N);
    const jitter = (Math.random() - 0.5) * STEP * 0.6;
    const center = index * STEP + STEP / 2 + jitter;
    const current = rotation.current;
    const delta = ((360 - center - (current % 360)) % 360 + 360) % 360;
    const next = current + 360 * 5 + delta;
    rotation.current = next;
    target.current = index;
    setResult(null);
    setSpinning(true);
    setHasSpun(true);
    setAngle(next);
  }

  function done() {
    if (!spinning) return;
    setSpinning(false);
    setResult(DATE_IDEAS[target.current]);
  }

  return (
    <section className="flex flex-col items-center">
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">Spin for our date ✨</h1>
      <p className="mt-2 text-wine/70">Fate picks the plan.</p>

      <div className="relative mt-6 w-[min(88vw,26rem)]">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 -translate-y-2 border-x-[14px] border-t-[26px] border-x-transparent border-t-wine drop-shadow-md"
        />
        <motion.svg
          viewBox="0 0 400 400"
          role="img"
          aria-label="Date idea wheel with 15 emoji sections"
          className="block w-full drop-shadow-xl"
          animate={{ rotate: angle }}
          transition={reduce ? { duration: 0.4 } : { duration: 5.2, ease: [0.12, 0.7, 0.1, 1] }}
          onAnimationComplete={done}
        >
          <circle cx={C} cy={C} r={R + 8} fill="#4A0E2B" />
          {DATE_IDEAS.map((idea, i) => {
            const mid = i * STEP + STEP / 2;
            const p = point(0, R * 0.74);
            return (
              <g key={i}>
                <path d={wedge(i)} fill={COLORS[i % COLORS.length]} stroke="#FFF0F3" strokeWidth="1.5" />
                <g transform={`rotate(${mid} ${C} ${C})`}>
                  <text x={p.x} y={p.y} fontSize="30" textAnchor="middle" dominantBaseline="central">
                    {idea.emoji}
                  </text>
                </g>
              </g>
            );
          })}
          <circle cx={C} cy={C} r="26" fill="#4A0E2B" />
          <text x={C} y={C} fontSize="24" textAnchor="middle" dominantBaseline="central">❤️</text>
        </motion.svg>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="mt-8 h-14 rounded-full bg-gradient-to-r from-rose to-peach px-10 text-lg font-bold text-wine shadow-lg shadow-rose/50 transition hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
      >
        {spinning ? "Spinning…" : hasSpun ? "Spin again" : "SPIN ❤️"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-wine/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="result-title"
              initial={{ scale: 0.6, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full max-w-md rounded-3xl bg-blush p-8 text-center shadow-2xl"
            >
              <div className="text-7xl" aria-hidden>{result.emoji}</div>
              <h2 id="result-title" className="mt-4 font-display text-3xl font-semibold">Our date is…</h2>
              <p className="mt-3 text-lg leading-relaxed">{result.text}</p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  autoFocus
                  onClick={() => onConfirm(result)}
                  className="rounded-full bg-gradient-to-r from-rose to-peach px-6 py-4 text-lg font-semibold text-wine shadow-lg shadow-rose/40 transition hover:scale-[1.02] active:scale-95"
                >
                  Pick a day and time
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="rounded-full px-6 py-2 text-sm font-medium text-wine/70 hover:text-wine"
                >
                  Spin again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
