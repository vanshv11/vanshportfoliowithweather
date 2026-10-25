// Current-weather data layer (OpenWeather). Framework-free so it can be reused by
// the top-right weather box now and the window scene later.

export type Units = 'metric' | 'imperial'

export type Condition = 'storm' | 'rain' | 'snow' | 'mist' | 'clear' | 'clouds'

export interface Weather {
  temp: number
  feelsLike: number
  humidity: number
  /** m/s for metric, mph for imperial (OpenWeather's units). */
  windSpeed: number
  condition: Condition
  /** Sentence case, e.g. "Clear sky". */
  description: string
  isDay: boolean
  city: string
  /** Observation time, ms since epoch. */
  updatedAt: number
}

export interface WeatherQuery {
  lat: number
  lon: number
  units: Units
}

/** Thrown when OpenWeather rejects the key (401) — new keys can take a couple of hours to activate. */
export class InvalidKeyError extends Error {}

export const apiKey: string = (import.meta.env.VITE_OPENWEATHER_API_KEY ?? '').trim()

/** OpenWeather condition id → coarse condition. */
export function conditionFromId(id: number): Condition {
  if (id >= 200 && id < 300) return 'storm'
  if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) return 'rain'
  if (id >= 600 && id < 700) return 'snow'
  if (id >= 700 && id < 800) return 'mist'
  if (id === 800) return 'clear'
  return 'clouds'
}

const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export async function getCurrentWeather(
  { lat, lon, units }: WeatherQuery,
  { key = apiKey, signal }: { key?: string; signal?: AbortSignal } = {},
): Promise<Weather> {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather')
  url.search = new URLSearchParams({ lat: String(lat), lon: String(lon), units, appid: key }).toString()

  const res = await fetch(url, { signal: signal ?? AbortSignal.timeout(8000) })
  if (res.status === 401) throw new InvalidKeyError('OpenWeather rejected the API key')
  if (!res.ok) throw new Error(`OpenWeather responded ${res.status}`)

  const d = await res.json()
  const now = d.dt as number
  return {
    temp: d.main.temp,
    feelsLike: d.main.feels_like,
    humidity: d.main.humidity,
    windSpeed: d.wind?.speed ?? 0,
    condition: conditionFromId(d.weather?.[0]?.id ?? 800),
    description: sentenceCase(d.weather?.[0]?.description ?? ''),
    isDay: now >= d.sys.sunrise && now < d.sys.sunset,
    city: d.name ?? '',
    updatedAt: now * 1000,
  }
}

/** Shown when there is no key, or the key is rejected. Clearly labelled as demo data in the UI. */
export const mockWeather: Weather = {
  temp: 24,
  feelsLike: 25,
  humidity: 48,
  windSpeed: 3.2,
  condition: 'clear',
  description: 'Clear sky',
  isDay: true,
  city: 'Demo city',
  updatedAt: 0,
}
