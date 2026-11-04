"use client";

import { LocateFixed, RefreshCw } from "lucide-react";

import { PRESET_CITIES } from "@/lib/cities";
import { cn } from "@/lib/cn";

type LocationBarProps = {
  cityId: string;
  locating: boolean;
  loading: boolean;
  onSelectCity: (cityId: string) => void;
  onUseGps: () => void;
  onReload: () => void;
};

export function LocationBar({
  cityId,
  locating,
  loading,
  onSelectCity,
  onUseGps,
  onReload,
}: LocationBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_CITIES.map((city) => {
          const selected = cityId === city.id;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city.id)}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.98]",
                selected
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/15 text-white hover:bg-white/25",
              )}
            >
              {city.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUseGps}
          disabled={locating}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-semibold text-slate-900 shadow-lg transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-[0.98] disabled:opacity-70"
        >
          <LocateFixed className={cn("h-4 w-4", locating && "animate-pulse")} />
          {locating ? "現在地を取得中..." : "現在地を使う"}
        </button>
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.98]"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          再読み込み
        </button>
      </div>
    </div>
  );
}
