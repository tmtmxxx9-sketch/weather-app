function normalizeBaseUrl(value: string): string {
  const stripped = value
    .replace(/^\[/, "")
    .replace(/\]\([^)]*\)$/, "")
    .trim();
  return stripped.replace(/\/$/, "");
}

export function getWeatherApiBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_WEATHER_API_BASE_URL ?? "").trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_WEATHER_API_BASE_URL が未設定です。.env.local を確認してください。");
  }
  return normalizeBaseUrl(raw);
}

export function getWeatherApiKey(): string | undefined {
  const key = (process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? "").trim();
  if (!key || key === "free_open_meteo_key") return undefined;
  return key;
}
