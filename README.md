# Vansh Vyas — Portfolio

A dark, editor-style single-page portfolio built with Astro, Tailwind CSS v4 and TypeScript.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # type-check .astro and .ts files
npm run build    # static output in dist/
```

## Editing content

Everything lives in `src/config/site.ts`:

- `about` — replace the two `[placeholder]` paragraphs.
- `focus` — the "What I'm into" list. These are interests, not claimed expertise; trim to what's true.
- `projects` — add entries (`name`, `summary`, `stack`, optional `github` / `live`). While empty, the Work section shows a "first case study in progress" row.
- `socials` — fill in `href` to turn each "link coming soon" button into a real link.
- `weather` — `city`, `latitude`, `longitude` and `units` (`metric` / `imperial`) for the weather box (see below).
- `timezone` — set an IANA zone (e.g. `Asia/Kolkata`) to show local time in the footer.
- `url` — set the real domain before deploying (used for canonical and social preview URLs).

`public/og.png` is the social preview image (1200×630).

### Weather box (top-right)

A square card showing live weather from [OpenWeather](https://openweathermap.org/) for the city in `site.weather`.

- **API key:** paste it after the `=` in `.env.local` (`VITE_OPENWEATHER_API_KEY=…`), then restart `npm run dev`.
  `.env.local` is git-ignored; `.env.example` shows the format. For a deployed site, set the same variable in
  the host's environment settings before building. The key is public by design: it ships in the browser bundle.
- **Without a key** (or while a new key is still activating, which can take up to ~2 hours) the box shows demo data
  labelled "demo data", and `npm run dev` logs one console warning.
- **Behaviour:** fetches on load, refreshes every 15 minutes and when the tab becomes visible, and caches the last
  result in `sessionStorage`. If a request fails it keeps the last good reading, or shows "Weather unavailable".
- **Layout:** from 1024px wide it sits top-right beside the heading; below that it moves into the flow beside the
  `whoami` prompt line, at a smaller size.
- **Code:** `src/lib/weather.ts` (`getCurrentWeather`, `mockWeather`, `conditionFromId`) and
  `src/lib/watchWeather.ts` (the subscribe/refresh/cache logic) are framework-free. Reuse them for any other
  weather UI rather than calling the API again. The box itself is `src/components/WeatherBox.astro`.

## Structure

```
src/
├─ config/site.ts          content
├─ lib/weather.ts          OpenWeather fetch + normalise + mock data
├─ lib/watchWeather.ts     live weather subscription (refresh, cache, status)
├─ layouts/Layout.astro    <head>, metadata, skip link
├─ pages/index.astro       page composition
├─ components/             Nav, Hero, About, FocusList, WorkIndex, Contact, Footer,
│                          PageFrame, SectionHeading, Annotation, MarkerNote, SocialButton,
│                          WeatherBox, Icon
├─ scripts/annotations.ts  draws marker annotations once when scrolled into view
└─ styles/global.css       design tokens, fonts, motion (respects prefers-reduced-motion)
```
