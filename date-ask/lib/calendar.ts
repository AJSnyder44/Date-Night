export interface DateDetails {
  date: string; // YYYY-MM-DD (local)
  time: string; // HH:mm (local)
  location?: string;
  note?: string;
}

export const EVENT_TITLE = "Our Date ❤️";
const DURATION_MS = 2 * 60 * 60 * 1000;

export function toStart(d: DateDetails): Date {
  const [y, m, day] = d.date.split("-").map(Number);
  const [h, min] = d.time.split(":").map(Number);
  return new Date(y, m - 1, day, h, min, 0);
}

const pad = (n: number) => String(n).padStart(2, "0");

export function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function utc(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = " " + rest.slice(74); }
  out.push(rest);
  return out.join("\r\n");
}

export function buildIcs(d: DateDetails): string {
  const start = toStart(d);
  const end = new Date(start.getTime() + DURATION_MS);
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@date-ask`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Date Ask//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${icsEscape(EVENT_TITLE)}`,
    d.location ? `LOCATION:${icsEscape(d.location)}` : "",
    d.note ? `DESCRIPTION:${icsEscape(d.note)}` : "",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(EVENT_TITLE)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadIcs(d: DateDetails): void {
  const blob = new Blob([buildIcs(d)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "our-date.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function googleCalendarUrl(d: DateDetails): string {
  const start = toStart(d);
  const end = new Date(start.getTime() + DURATION_MS);
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${utc(start)}/${utc(end)}`,
    details: d.note ?? "",
    location: d.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function outlookCalendarUrl(d: DateDetails): string {
  const start = toStart(d);
  const end = new Date(start.getTime() + DURATION_MS);
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: EVENT_TITLE,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: d.note ?? "",
    location: d.location ?? "",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}
