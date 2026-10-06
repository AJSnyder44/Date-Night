"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const EMOJI = ["❤️", "💖", "💕", "✨", "🎉", "💗", "🌹"];

export default function Celebration() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 380;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 120,
          size: 18 + Math.random() * 28,
          rotate: Math.random() * 720 - 360,
          emoji: EMOJI[i % EMOJI.length],
        };
      }),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{ fontSize: p.size }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], scale: [0, 1.2, 1], rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
