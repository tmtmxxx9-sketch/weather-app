"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_CITY, type City } from "@/lib/cities";
import { fetchForecast } from "@/lib/weather";
import type { WeatherPayload } from "@/types/weather";

type LocationState =
  | { kind: "city"; city: City }
  | { kind: "gps"; latitude: number; longitude: number; label: string };

export function useWeather() {
  const [location, setLocation] = useState<LocationState>({
    kind: "city",
    city: DEFAULT_CITY,
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [data, setData] = useState<WeatherPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    if (location.kind === "city") {
      return {
        latitude: location.city.latitude,
        longitude: location.city.longitude,
        timezone: location.city.timezone,
        label: location.city.name,
        cityId: location.city.id,
      };
    }
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: "auto",
      label: location.label,
      cityId: "gps",
    };
  }, [location]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const forecast = await fetchForecast({
        latitude: query.latitude,
        longitude: query.longitude,
        timezone: query.timezone,
        city: query.cityId,
      });
      setData(forecast);
      setSelectedDate((current) => {
        const dates = forecast.daily.map((day) => day.date);
        if (current && dates.includes(current)) return current;
        return dates[0] ?? "";
      });
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "天気データの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [query.latitude, query.longitude, query.timezone]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedDay = data?.daily.find((day) => day.date === selectedDate) ?? null;
  const hourlyForDay =
    data?.hourly.filter((item) => item.time.slice(0, 10) === selectedDate) ?? [];

  const selectCity = useCallback((city: City) => {
    setLocation({ kind: "city", city });
  }, []);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("このブラウザでは現在地を取得できません。");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          kind: "gps",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "現在地",
        });
        setLocating(false);
      },
      (geoError) => {
        setLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError("現在地の利用が許可されていません。ブラウザの設定を確認してください。");
          return;
        }
        setError("現在地を取得できませんでした。都市を選んでください。");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  return {
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
    reload: load,
  };
}
