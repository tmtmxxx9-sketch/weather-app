"use client";

import { Droplets, Thermometer, Umbrella, Wind } from "lucide-react";

import { cn } from "@/lib/cn";
import { getWeatherLabel } from "@/lib/weather";
import type { CurrentWeather, DailyWeather } from "@/types/weather";
import { WeatherIcon } from "@/components/WeatherIcon";

type CurrentPanelProps = {
  label: string;
  current: CurrentWeather;
  selectedDay: DailyWeather | null;
  isToday: boolean;
};

export function CurrentPanel({ label, current, selectedDay, isToday }: CurrentPanelProps) {
  const code = isToday ? current.weatherCode : (selectedDay?.weatherCode ?? current.weatherCode);
  const temperature = isToday
    ? current.temperature
    : ((selectedDay?.temperatureMax ?? current.temperature) +
        (selectedDay?.temperatureMin ?? current.temperature)) /
      2;
  const humidity = current.humidity;
  const wind = isToday ? current.windSpeed : (selectedDay?.windSpeedMax ?? current.windSpeed);
  const pop = isToday
    ? current.precipitationProbability
    : (selectedDay?.precipitationProbability ?? current.precipitationProbability);

  return (
    <section className="rounded-3xl bg-white/90 p-5 text-slate-900 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <h2 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
            {Math.round(temperature)}
            <span className="ml-1 text-2xl font-medium text-slate-400">°C</span>
          </h2>
          <p className="mt-2 flex items-center gap-2 text-base font-medium text-slate-600">
            <WeatherIcon code={code} isDay={isToday ? current.isDay : true} className="h-5 w-5 text-sky-600" />
            {getWeatherLabel(code)}
          </p>
          {selectedDay ? (
            <p className="mt-2 text-sm text-slate-500">
              最低 {Math.round(selectedDay.temperatureMin)}° / 最高 {Math.round(selectedDay.temperatureMax)}°
            </p>
          ) : null}
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-600">
          <WeatherIcon code={code} isDay={isToday ? current.isDay : true} className="h-10 w-10" />
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Thermometer} label="体感" value={`${Math.round(current.apparentTemperature)}°`} />
        <Stat icon={Droplets} label="湿度" value={`${Math.round(humidity)}%`} />
        <Stat
          icon={Umbrella}
          label="降水確率"
          value={pop == null ? "—" : `${Math.round(pop)}%`}
        />
        <Stat icon={Wind} label="風速" value={`${Math.round(wind)} km/h`} />
      </dl>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-slate-50 px-3 py-3")}>
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
