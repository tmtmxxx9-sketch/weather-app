"use client";

import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatMonthDay, formatWeekday, getWeatherLabel } from "@/lib/weather";
import type { DailyWeather } from "@/types/weather";
import { WeatherIcon } from "@/components/WeatherIcon";

type DateTabsProps = {
  days: DailyWeather[];
  selectedDate: string;
  onSelect: (date: string) => void;
};

export function DateTabs({ days, selectedDate, onSelect }: DateTabsProps) {
  return (
    <section className="rounded-3xl bg-white/15 p-3 ring-1 ring-white/20 backdrop-blur">
      <div className="mb-3 flex items-center gap-2 px-1 text-sm font-semibold text-white/90">
        <CalendarDays className="h-4 w-4" />
        日付を選ぶ
      </div>
      <div
        role="tablist"
        aria-label="7日間の予報"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {days.map((day, index) => {
          const selected = day.date === selectedDate;
          return (
            <button
              key={day.date}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(day.date)}
              className={cn(
                "min-h-24 min-w-[92px] shrink-0 rounded-2xl px-3 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.98]",
                selected
                  ? "bg-white text-slate-900 shadow-xl"
                  : "bg-white/10 text-white hover:bg-white/20",
              )}
            >
              <p className="text-xs font-semibold opacity-70">
                {index === 0 ? "今日" : formatWeekday(day.date)}
              </p>
              <p className="mt-1 text-sm font-bold">{formatMonthDay(day.date)}</p>
              <WeatherIcon
                code={day.weatherCode}
                className={cn("mt-2 h-5 w-5", selected ? "text-sky-600" : "text-white")}
              />
              <p className="mt-2 text-xs font-medium opacity-80">
                {Math.round(day.temperatureMin)}/{Math.round(day.temperatureMax)}°
              </p>
              <p className="sr-only">{getWeatherLabel(day.weatherCode)}</p>
            </button>
          );
        })}
      </div>
      <label className="mt-3 flex min-h-11 items-center gap-3 rounded-2xl bg-white/10 px-3 text-sm text-white">
        <span className="font-semibold">カレンダー</span>
        <input
          type="date"
          value={selectedDate}
          min={days[0]?.date}
          max={days[days.length - 1]?.date}
          onChange={(event) => {
            if (event.target.value) onSelect(event.target.value);
          }}
          className="min-h-11 flex-1 rounded-xl border-0 bg-transparent text-white outline-none [color-scheme:dark] focus-visible:ring-4 focus-visible:ring-white/30"
        />
      </label>
    </section>
  );
}
