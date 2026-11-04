import { getWeatherApiBaseUrl, getWeatherApiKey } from "@/lib/config";
import type {
  CurrentWeather,
  DailyWeather,
  ForecastResponse,
  HourlyWeather,
  WeatherCondition,
  WeatherPayload,
} from "@/types/weather";

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

function nearestHourlyValue(
  hourly: HourlyWeather[],
  currentTime: string,
  key: keyof Pick<HourlyWeather, "precipitationProbability">,
): number | null {
  if (hourly.length === 0) return null;
  const current = new Date(currentTime).getTime();
  let closest = hourly[0];
  let best = Math.abs(new Date(closest.time).getTime() - current);
  for (const item of hourly) {
    const diff = Math.abs(new Date(item.time).getTime() - current);
    if (diff < best) {
      closest = item;
      best = diff;
    }
  }
  return closest[key];
}

export async function fetchForecast(params: {
  latitude: number;
  longitude: number;
  timezone: string;
}): Promise<WeatherPayload> {
  const url = new URL(getWeatherApiBaseUrl());
  url.searchParams.set("latitude", String(params.latitude));
  url.searchParams.set("longitude", String(params.longitude));
  url.searchParams.set("timezone", params.timezone);
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability,is_day",
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
  );

  const apiKey = getWeatherApiKey();
  if (apiKey) url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`天気データの取得に失敗しました（${response.status}）`);
  }

  const data = (await response.json()) as ForecastResponse;
  const hourly = mapHourly(data);
  const daily = mapDaily(data);
  const current = mapCurrent(data, hourly);

  return {
    timezone: data.timezone ?? params.timezone,
    current,
    hourly,
    daily,
  };
}

function mapCurrent(data: ForecastResponse, hourly: HourlyWeather[]): CurrentWeather {
  const current = data.current ?? {};
  const time = current.time ?? new Date().toISOString();
  return {
    time,
    temperature: current.temperature_2m ?? 0,
    apparentTemperature: current.apparent_temperature ?? current.temperature_2m ?? 0,
    humidity: current.relative_humidity_2m ?? 0,
    windSpeed: current.wind_speed_10m ?? 0,
    precipitationProbability:
      current.precipitation_probability ??
      nearestHourlyValue(hourly, time, "precipitationProbability"),
    weatherCode: current.weather_code ?? 0,
    isDay: current.is_day !== 0,
  };
}

function mapHourly(data: ForecastResponse): HourlyWeather[] {
  const hourly = data.hourly;
  const times = hourly?.time ?? [];
  return times.map((time, index) => ({
    time,
    temperature: hourly?.temperature_2m?.[index] ?? 0,
    humidity: hourly?.relative_humidity_2m?.[index] ?? 0,
    windSpeed: hourly?.wind_speed_10m?.[index] ?? 0,
    precipitationProbability: hourly?.precipitation_probability?.[index] ?? 0,
    weatherCode: hourly?.weather_code?.[index] ?? 0,
  }));
}

function mapDaily(data: ForecastResponse): DailyWeather[] {
  const daily = data.daily;
  const dates = daily?.time ?? [];
  return dates.map((date, index) => ({
    date,
    weatherCode: daily?.weather_code?.[index] ?? 0,
    temperatureMax: daily?.temperature_2m_max?.[index] ?? 0,
    temperatureMin: daily?.temperature_2m_min?.[index] ?? 0,
    precipitationProbability: daily?.precipitation_probability_max?.[index] ?? 0,
    windSpeedMax: daily?.wind_speed_10m_max?.[index] ?? 0,
  }));
}
