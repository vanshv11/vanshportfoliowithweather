interface ImportMetaEnv {
  /** OpenWeather API key. Public by design: it ships in the client bundle. */
  readonly VITE_OPENWEATHER_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
