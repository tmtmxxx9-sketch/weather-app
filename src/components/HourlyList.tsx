"use client";

import { Clock3 } from "lucide-react";

import { formatHour, getWeatherLabel } from "@/lib/weather";
import type { HourlyWeather } from "@/types/weather";
import { WeatherIcon } from "@/components/WeatherIcon";

type HourlyListProps = {
  hours: HourlyWeather[];
};

export function HourlyList({ hours }: HourlyListProps) {
  if (hours.length === 0) {
    return (
      <section className="rounded-3xl bg-white/90 p-6 text-center text-sm text-slate-500">
        この日の時間別予報はありません。
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-2xl shadow-slate-950/10">
      <div className="mb-3 flex items-center gap-2 px-1 text-sm font-semibold text-slate-700">
        <Clock3 className="h-4 w-4" />
        時間別予報
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {hours.map((hour) => (
          <article
            key={hour.time}
            className="min-w-[84px] rounded-2xl bg-slate-50 px-3 py-3 text-center"
          >
            <p className="text-xs font-semibold text-slate-500">{formatHour(hour.time)}</p>
            <WeatherIcon code={hour.weatherCode} className="mx-auto mt-2 h-5 w-5 text-sky-600" />
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {Math.round(hour.temperature)}°
            </p>
            <p className="mt-1 text-[11px] font-medium text-sky-700">
              降水 {Math.round(hour.precipitationProbability)}%
            </p>
            <p className="sr-only">{getWeatherLabel(hour.weatherCode)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
