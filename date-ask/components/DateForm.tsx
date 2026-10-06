"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DateDetails, downloadIcs, googleCalendarUrl, localDateString, outlookCalendarUrl, toStart,
} from "@/lib/calendar";

const field =
  "w-full rounded-xl border-2 border-rose-soft bg-white/80 px-4 py-3 text-base text-wine placeholder:text-wine/40 focus:border-rose focus:outline-none";
const linkBtn = "rounded-full border-2 border-wine/30 px-4 py-2 text-sm font-medium hover:bg-white";

export default function DateForm() {
  const today = localDateString();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<DateDetails | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) return setError("Pick a date and a start time first.");
    const d: DateDetails = { date, time, location: location.trim(), note: note.trim() };
    if (toStart(d).getTime() <= Date.now()) return setError("That moment has already passed. Pick a time in the future.");
    setError(null);
    setDetails(d);
    downloadIcs(d);
  }

  const pretty = details ? toStart(details).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" }) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-3xl bg-white/60 p-6 text-left shadow-xl shadow-rose/20 backdrop-blur-md sm:p-8"
    >
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">Yay! I can&apos;t wait! ❤️</h1>
      <p className="mt-2 text-wine/70">Pick a time that works for you.</p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium">Date</label>
            <input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required className={field} />
          </div>
          <div>
            <label htmlFor="time" className="mb-1 block text-sm font-medium">Start time</label>
            <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={field} />
          </div>
        </div>
        <div>
          <label htmlFor="loc" className="mb-1 block text-sm font-medium">Location (optional)</label>
          <input id="loc" type="text" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={200} placeholder="A cozy place with good dessert" className={field} />
        </div>
        <div>
          <label htmlFor="note" className="mb-1 block text-sm font-medium">Note (optional)</label>
          <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="Anything I should know?" className={field} />
        </div>

        {error && <p role="alert" className="rounded-xl bg-wine px-4 py-2 text-sm text-blush">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-rose to-peach px-6 py-4 text-lg font-semibold text-wine shadow-lg shadow-rose/40 transition hover:scale-[1.02] active:scale-95"
        >
          Add to Apple Calendar
        </button>
      </form>

      {details && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5 overflow-hidden" aria-live="polite">
          <p className="text-sm">
            Saved <strong>{pretty}</strong>. Open the downloaded file to add it to Apple Calendar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={googleCalendarUrl(details)} target="_blank" rel="noopener noreferrer" className={linkBtn}>Google Calendar</a>
            <a href={outlookCalendarUrl(details)} target="_blank" rel="noopener noreferrer" className={linkBtn}>Outlook Calendar</a>
            <button type="button" onClick={() => downloadIcs(details)} className={linkBtn}>Download again</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
