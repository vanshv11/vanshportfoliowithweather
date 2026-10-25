// Subscribe to live weather: fetches immediately, refreshes every 15 minutes (and when
// the tab becomes visible again), caches the last good result in sessionStorage.
// This is the framework-free equivalent of a `useWeather` hook.

import { apiKey, getCurrentWeather, InvalidKeyError, mockWeather, type Weather, type WeatherQuery } from './weather'

export type WeatherStatus = 'loading' | 'ready' | 'mock' | 'error'

export interface WeatherState {
  data: Weather | null
  status: WeatherStatus
}

const REFRESH_MS = 15 * 60 * 1000
let warned = false

function warnOnce(message: string) {
  if (import.meta.env.DEV && !warned) {
    warned = true
    console.warn(`[weather] ${message}`)
  }
}

function readCache(key: string): Weather | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Weather & { fetchedAt?: number }) : null
  } catch {
    return null
  }
}

function writeCache(key: string, data: Weather) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ...data, fetchedAt: Date.now() }))
  } catch {
    // Storage unavailable (private mode, blocked) — just refetch next time.
  }
}

function cacheAge(key: string): number {
  try {
    const raw = sessionStorage.getItem(key)
    const fetchedAt = raw ? (JSON.parse(raw).fetchedAt as number | undefined) : undefined
    return fetchedAt ? Date.now() - fetchedAt : Infinity
  } catch {
    return Infinity
  }
}

/** Returns an unsubscribe function. `city` overrides the name OpenWeather returns. */
export function watchWeather(
  query: WeatherQuery & { city?: string },
  onChange: (state: WeatherState) => void,
): () => void {
  const label = (w: Weather): Weather => ({ ...w, city: query.city || w.city })
  const mock = () => onChange({ data: label(mockWeather), status: 'mock' })

  if (!apiKey) {
    warnOnce('No VITE_OPENWEATHER_API_KEY set — showing demo data. Add it to .env.local and restart the dev server.')
    mock()
    return () => {}
  }

  const key = `weather:v2:${query.lat},${query.lon},${query.units}`
  let last: Weather | null = readCache(key)
  onChange(last ? { data: label(last), status: 'ready' } : { data: null, status: 'loading' })

  const update = async (force = false) => {
    if (!force && last && cacheAge(key) < REFRESH_MS) return
    try {
      last = await getCurrentWeather(query)
      writeCache(key, last)
      onChange({ data: label(last), status: 'ready' })
    } catch (err) {
      if (err instanceof InvalidKeyError) {
        warnOnce('OpenWeather rejected the API key (401). New keys can take up to ~2 hours to activate. Showing demo data.')
        mock()
      } else if (!last) {
        // Keep showing the last good reading if there is one; otherwise report the error.
        onChange({ data: null, status: 'error' })
      }
    }
  }

  update()
  const timer = setInterval(() => {
    if (document.visibilityState === 'visible') update(true)
  }, REFRESH_MS)
  const onVisible = () => {
    if (document.visibilityState === 'visible') update()
  }
  document.addEventListener('visibilitychange', onVisible)

  return () => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisible)
  }
}
