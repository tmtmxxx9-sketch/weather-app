import { NextResponse } from "next/server";

import { PRESET_CITIES } from "@/lib/cities";
import { fetchOpenMeteoForecast } from "@/lib/open-meteo";

function parseCoordinate(value: string | null, name: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} が不正です。`);
  }
  return parsed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = (searchParams.get("city") ?? "").trim();
    const preset = PRESET_CITIES.find((city) => city.id === cityId);

    const latitude = searchParams.has("latitude")
      ? parseCoordinate(searchParams.get("latitude"), "latitude")
      : preset?.latitude;
    const longitude = searchParams.has("longitude")
      ? parseCoordinate(searchParams.get("longitude"), "longitude")
      : preset?.longitude;
    const timezone =
      (searchParams.get("timezone") ?? "").trim() || preset?.timezone || "auto";

    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "latitude と longitude、または有効な city が必要です。" },
        { status: 400 },
      );
    }

    const forecast = await fetchOpenMeteoForecast({
      latitude,
      longitude,
      timezone,
    });

    return NextResponse.json(forecast, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "天気データの取得に失敗しました。";
    const status = message.includes("未設定") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
