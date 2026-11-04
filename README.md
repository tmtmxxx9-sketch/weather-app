# 天気予報アプリ

Next.js (App Router) + Tailwind CSS + Lucide React で、Open-Meteo の天気予報を表示します。

## 機能

- 東京・大阪・名古屋・岐阜・福岡・札幌のプリセット都市
- 現在地（GPS）取得
- 気温、天気、湿度、降水確率、風速
- 直近7日の日付タブとカレンダー切り替え
- 選択日の時間別予報
- ローディング / エラー表示
- 天気に応じた背景グラデーション

## 環境変数

`.env.local` を作成してください。

```env
NEXT_PUBLIC_WEATHER_API_BASE_URL=https://api.open-meteo.com/v1/forecast
NEXT_PUBLIC_WEATHER_API_KEY=free_open_meteo_key
```

API のベース URL はコードに直書きせず、`process.env.NEXT_PUBLIC_WEATHER_API_BASE_URL` から読みます。`.env.local` は `.gitignore` 対象です。

## 起動

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。
