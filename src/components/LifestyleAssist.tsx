"use client";

import { Home, Shirt, Umbrella, Wind } from "lucide-react";

import { cn } from "@/lib/cn";
import {
  average,
  getClothingAdvice,
  getIndoorAdvice,
  getUmbrellaAdvice,
  type AdviceTone,
  type LifestyleAdvice,
} from "@/lib/lifestyle";
import type { CurrentWeather, DailyWeather, HourlyWeather } from "@/types/weather";

const TONE_CLASS: Record<AdviceTone, string> = {
  ok: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  caution: "bg-amber-50 text-amber-800 ring-amber-100",
  alert: "bg-rose-50 text-rose-800 ring-rose-100",
  cool: "bg-sky-50 text-sky-800 ring-sky-100",
  warm: "bg-orange-50 text-orange-800 ring-orange-100",
};

type LifestyleAssistProps = {
  current: CurrentWeather;
  selectedDay: DailyWeather | null;
  hourly: HourlyWeather[];
  isToday: boolean;
};

export function LifestyleAssist({
  current,
  selectedDay,
  hourly,
  isToday,
}: LifestyleAssistProps) {
  const max = selectedDay?.temperatureMax ?? current.temperature;
  const min = selectedDay?.temperatureMin ?? current.temperature;
  const wind = selectedDay?.windSpeedMax ?? current.windSpeed;
  const pop = selectedDay?.precipitationProbability ?? current.precipitationProbability;
  const indoorTemp = isToday
    ? current.temperature
    : average(hourly.map((hour) => hour.temperature)) ?? (max + min) / 2;
  const indoorHumidity =
    (isToday ? current.humidity : average(hourly.map((hour) => hour.humidity))) ??
    current.humidity;
  const indoorWind =
    (isToday ? current.windSpeed : average(hourly.map((hour) => hour.windSpeed))) ?? wind;

  const clothing = getClothingAdvice({
    temperatureMax: max,
    temperatureMin: min,
    windSpeed: wind,
  });
  const umbrella = getUmbrellaAdvice(pop);
  const indoor = getIndoorAdvice({
    temperature: indoorTemp,
    humidity: indoorHumidity,
    windSpeed: indoorWind,
  });

  return (
    <section className="rounded-3xl bg-white/90 p-4 text-slate-900 shadow-2xl shadow-slate-950/10 sm:p-5">
      <div className="mb-3">
        <p className="text-xs font-bold tracking-[0.16em] text-slate-400">LIFE ASSIST</p>
        <h3 className="mt-1 text-lg font-semibold">生活アシスト</h3>
        <p className="mt-1 text-sm text-slate-500">
          選択した日の気温・降水・湿度から、服装・傘・室内の判断をまとめます。
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <AdviceCard icon={Shirt} advice={clothing} />
        <AdviceCard icon={Umbrella} advice={umbrella} />
        <AdviceCard icon={indoor.tone === "ok" ? Wind : Home} advice={indoor} />
      </div>
    </section>
  );
}

function AdviceCard({
  icon: Icon,
  advice,
}: {
  icon: typeof Shirt;
  advice: LifestyleAdvice;
}) {
  return (
    <article className="flex min-h-[180px] flex-col rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        {advice.title}
      </div>
      <p
        className={cn(
          "inline-flex min-h-11 items-center rounded-full px-3 text-xs font-bold ring-1",
          TONE_CLASS[advice.tone],
        )}
      >
        {advice.badge}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{advice.body}</p>
    </article>
  );
}
