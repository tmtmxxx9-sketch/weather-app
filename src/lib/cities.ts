export type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export const PRESET_CITIES: City[] = [
  { id: "tokyo", name: "東京", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo" },
  { id: "osaka", name: "大阪", latitude: 34.6937, longitude: 135.5023, timezone: "Asia/Tokyo" },
  { id: "nagoya", name: "名古屋", latitude: 35.1815, longitude: 136.9066, timezone: "Asia/Tokyo" },
  { id: "gifu", name: "岐阜", latitude: 35.4233, longitude: 136.7606, timezone: "Asia/Tokyo" },
  { id: "fukuoka", name: "福岡", latitude: 33.5902, longitude: 130.4017, timezone: "Asia/Tokyo" },
  { id: "sapporo", name: "札幌", latitude: 43.0618, longitude: 141.3545, timezone: "Asia/Tokyo" },
];

export const DEFAULT_CITY = PRESET_CITIES[0];
