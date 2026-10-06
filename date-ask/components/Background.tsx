"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle { id: number; left: number; size: number; duration: number; delay: number; sway: number; emoji: string }

const EMOJI = ["❤️", "💗", "💖", "✨", "💕", "🌸"];

export default function Background() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Particle[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 26,
        duration: 12 + Math.random() * 14,
        delay: -Math.random() * 20,
        sway: 20 + Math.random() * 40,
        emoji: EMOJI[i % EMOJI.length],
      }))
    );
  }, []);

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-peach/40 blur-3xl" />
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none opacity-60"
          style={{ left: `${p.left}%`, bottom: -60, fontSize: p.size }}
          animate={{ y: ["0vh", "-115vh"], x: [0, p.sway, -p.sway, 0], rotate: [0, 15, -15, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
