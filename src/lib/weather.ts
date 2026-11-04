import type { WeatherCondition, WeatherPayload } from "@/types/weather";

export function getWeatherCondition(code: number): WeatherCondition {
  if (code >= 71 && code <= 77) return "snow";
  if (code === 85 || code === 86) return "snow";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95) return "rain";
  if (code >= 2) return "cloudy";
  return "clear";
}

export function getWeatherLabel(code: number): string {
  if (code === 0) return "快晴";
  if (code === 1) return "晴れ";
  if (code === 2) return "晴れ時々曇り";
  if (code === 3) return "曇り";
  if (code === 45 || code === 48) return "霧";
  if (code >= 51 && code <= 57) return "霧雨";
  if (code >= 61 && code <= 67) return "雨";
  if (code >= 71 && code <= 77) return "雪";
  if (code >= 80 && code <= 82) return "にわか雨";
  if (code === 85 || code === 86) return "にわか雪";
  if (code >= 95) return "雷雨";
  return "不明";
}

export function formatWeekday(date: string): string {
  return new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(new Date(`${date}T00:00:00`));
}

export function formatMonthDay(date: string): string {
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );
}

export function formatHour(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  );
}

export async function fetchForecast(params: {
  latitude: number;
  longitude: number;
  timezone: string;
  city?: string;
}): Promise<WeatherPayload> {
  const search = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    timezone: params.timezone,
  });
  if (params.city) search.set("city", params.city);

  const response = await fetch(`/api/weather?${search.toString()}`, { cache: "no-store" });
  const payload = (await response.json()) as WeatherPayload & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || `天気データの取得に失敗しました（${response.status}）`);
  }

  return payload;
}
