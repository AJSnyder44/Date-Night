"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Nice try 😏",
  "Not so fast ❤️",
  "I think you meant Yes 😉",
  "Give the Yes button a chance!",
  "The No button is shy today 🙈",
  "Plot twist: it's still Yes 💘",
];
const PAD = 16;
const TRIGGER_DISTANCE = 90;

interface Props { onEscape: () => void }

const ButtonEl = forwardRef<HTMLButtonElement, { onEscape: () => void }>(function ButtonEl({ onEscape }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onPointerEnter={onEscape}
      onFocus={onEscape}
      onClick={onEscape}
      className="h-14 w-36 rounded-full border-2 border-wine/30 bg-white/70 px-6 text-lg font-semibold text-wine backdrop-blur transition-colors hover:bg-white"
    >
      NO 😢
    </button>
  );
});

export default function NoButton({ onEscape }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const last = useRef(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);

  const escape = useCallback(() => {
    const now = Date.now();
    if (now - last.current < 350) return;
    last.current = now;
    const el = btn.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxX = Math.max(PAD, window.innerWidth - rect.width - PAD);
    const maxY = Math.max(PAD, window.innerHeight - rect.height - PAD);

    const cur = pos ?? { x: rect.left, y: rect.top };
    let next = { x: PAD, y: PAD };
    for (let i = 0; i < 12; i++) {
      next = { x: PAD + Math.random() * (maxX - PAD), y: PAD + Math.random() * (maxY - PAD) };
      if (Math.hypot(next.x - cur.x, next.y - cur.y) > 160) break;
    }
    if (!pos) setPos(cur); // detach from layout at its current spot first
    requestAnimationFrame(() => setPos(next));

    onEscape();
    if (Math.random() < 0.6) setMsg({ id: now, text: MESSAGES[Math.floor(Math.random() * MESSAGES.length)] });
  }, [pos, onEscape]);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1600);
    return () => clearTimeout(t);
  }, [msg]);

  // Proximity: a mouse approaching or a finger tapping near the button
  useEffect(() => {
    const near = (x: number, y: number) => {
      const r = btn.current?.getBoundingClientRect();
      if (!r) return false;
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      return Math.hypot(dx, dy) < TRIGGER_DISTANCE;
    };
    const onMove = (e: PointerEvent) => { if (e.pointerType === "mouse" && near(e.clientX, e.clientY)) escape(); };
    const onDown = (e: PointerEvent) => { if (near(e.clientX, e.clientY)) escape(); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [escape]);

  // Keep it in view after resize or rotation
  useEffect(() => {
    const onResize = () => {
      const r = btn.current?.getBoundingClientRect();
      if (!r || !pos) return;
      setPos({
        x: Math.min(Math.max(PAD, pos.x), Math.max(PAD, window.innerWidth - r.width - PAD)),
        y: Math.min(Math.max(PAD, pos.y), Math.max(PAD, window.innerHeight - r.height - PAD)),
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos]);

  return (
    <>
      {/* reserves the original spot in the layout */}
      <div className="h-14 w-36">{!pos && <ButtonEl ref={btn} onEscape={escape} />}</div>

      {pos && (
        <motion.div
          className="fixed left-0 top-0 z-40"
          initial={false}
          animate={{ x: pos.x, y: pos.y, rotate: [0, -12, 10, 0] }}
          transition={{ type: "spring", stiffness: 260, damping: 18, rotate: { duration: 0.5 } }}
        >
          <ButtonEl ref={btn} onEscape={escape} />
        </motion.div>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center px-4">
        <AnimatePresence>
          {msg && (
            <motion.p
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-full bg-wine px-5 py-2.5 text-sm font-medium text-blush shadow-lg shadow-wine/30"
            >
              {msg.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
