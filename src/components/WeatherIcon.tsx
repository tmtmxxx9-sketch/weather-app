import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

function resolveIcon(code: number, isDay: boolean): LucideIcon {
  if (code >= 95) return CloudLightning;
  if (code === 85 || code === 86 || (code >= 71 && code <= 77)) return CloudSnow;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain;
  if (code === 45 || code === 48) return CloudFog;
  if (code === 3) return Cloud;
  if (code === 2) return CloudSun;
  return isDay ? Sun : Moon;
}

type WeatherIconProps = {
  code: number;
  isDay?: boolean;
  className?: string;
};

export function WeatherIcon({ code, isDay = true, className }: WeatherIconProps) {
  const Icon = resolveIcon(code, isDay);
  return <Icon className={cn("h-6 w-6", className)} strokeWidth={1.75} />;
}
