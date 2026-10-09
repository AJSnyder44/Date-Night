# Date Ask ❤️

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Structure
```
date-ask/
├─ app/ (layout.tsx, page.tsx, globals.css)
├─ components/ (Background, Celebration, NoButton, DateForm)
├─ lib/calendar.ts   # .ics, Google and Outlook links
├─ package.json, tsconfig.json, next.config.mjs, postcss.config.mjs, tailwind.config.ts
```

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```
Requires Node 18.18+.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Go to vercel.com/new, import the repo. Framework is detected as Next.js; keep the defaults.
3. Click Deploy, then send the link.

CLI alternative: `npm i -g vercel && vercel --prod`.

## Notes
- Events last 2 hours; change `DURATION_MS` in `lib/calendar.ts`.
- The .ics file opens in Apple Calendar on iOS and macOS.
