"use client";

import { CloudAlert } from "lucide-react";

import { CurrentPanel } from "@/components/CurrentPanel";
import { DateTabs } from "@/components/DateTabs";
import { HourlyList } from "@/components/HourlyList";
import { LifestyleAssist } from "@/components/LifestyleAssist";
import { LocationBar } from "@/components/LocationBar";
import { useWeather } from "@/hooks/useWeather";
import { PRESET_CITIES } from "@/lib/cities";
import { cn } from "@/lib/cn";
import { getWeatherCondition } from "@/lib/weather";

const BACKGROUNDS: Record<string, string> = {
  clear: "from-sky-400 via-sky-500 to-amber-300",
  cloudy: "from-slate-400 via-slate-500 to-slate-700",
  rain: "from-indigo-600 via-blue-700 to-slate-900",
  snow: "from-sky-100 via-slate-200 to-indigo-300",
};

export function WeatherApp() {
  const {
    query,
    data,
    loading,
    locating,
    error,
    selectedDate,
    setSelectedDate,
    selectedDay,
    hourlyForDay,
    selectCity,
    useCurrentLocation,
    reload,
  } = useWeather();

  const condition = data
    ? getWeatherCondition(
        selectedDate === data.daily[0]?.date
          ? data.current.weatherCode
          : (selectedDay?.weatherCode ?? data.current.weatherCode),
      )
    : "clear";
  const isToday = selectedDate === data?.daily[0]?.date;

  return (
    <div
      className={cn(
        "min-h-full bg-gradient-to-br px-4 py-8 text-white transition-colors duration-500 sm:py-10",
        BACKGROUNDS[condition],
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <header>
          <p className="text-xs font-bold tracking-[0.2em] text-white/80">OPEN-METEO</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">天気予報</h1>
          <p className="mt-2 text-sm text-white/80 sm:text-base">
            都市を選ぶか現在地を使って、直近7日の天気を確認できます。
          </p>
        </header>

        <LocationBar
          cityId={query.cityId}
          locating={locating}
          loading={loading}
          onSelectCity={(id) => {
            const city = PRESET_CITIES.find((item) => item.id === id);
            if (city) selectCity(city);
          }}
          onUseGps={useCurrentLocation}
          onReload={() => void reload()}
        />

        {error ? (
          <div className="flex items-start gap-3 rounded-3xl bg-rose-500/95 p-4 text-white shadow-xl">
            <CloudAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">天気を取得できませんでした</p>
              <p className="mt-1 text-sm text-white/90">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="mt-3 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              >
                もう一度試す
              </button>
            </div>
          </div>
        ) : null}

        {loading && !data ? (
          <div className="space-y-3" aria-live="polite">
            <div className="h-48 animate-pulse rounded-3xl bg-white/25" />
            <div className="h-32 animate-pulse rounded-3xl bg-white/20" />
            <div className="h-40 animate-pulse rounded-3xl bg-white/15" />
            <p className="text-sm font-medium text-white/80">天気データを読み込んでいます...</p>
          </div>
        ) : null}

        {data ? (
          <div className={cn("space-y-5", loading && "opacity-70 transition")}>
            <CurrentPanel
              label={`${query.label}・${isToday ? "現在" : "選択した日"}`}
              current={data.current}
              selectedDay={selectedDay}
              isToday={Boolean(isToday)}
            />
            <DateTabs
              days={data.daily}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
            <LifestyleAssist
              current={data.current}
              selectedDay={selectedDay}
              hourly={hourlyForDay}
              isToday={Boolean(isToday)}
            />
            <HourlyList hours={hourlyForDay} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
