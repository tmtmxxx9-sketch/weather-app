export type AdviceTone = "ok" | "caution" | "alert" | "cool" | "warm";

export type LifestyleAdvice = {
  title: string;
  badge: string;
  body: string;
  tone: AdviceTone;
};

export function getClothingAdvice(input: {
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
}): LifestyleAdvice {
  const high = input.temperatureMax;
  const low = input.temperatureMin;
  const gap = high - low;
  const feel = (high + low) / 2;
  const extras: string[] = [];

  if (gap >= 8) extras.push("朝晩の寒暖差が大きいので、脱ぎ着できる羽織りがあると安心です。");
  if (input.windSpeed >= 25) extras.push("風が強いので、一枚多めにすると体感が安定します。");

  if (feel <= 10) {
    return {
      title: "服装提案",
      badge: "しっかり防寒対策を",
      body: ["冬物コートや厚手のアウターが必要です。手袋やマフラーも検討してください。", ...extras].join(" "),
      tone: "cool",
    };
  }

  if (feel <= 15) {
    return {
      title: "服装提案",
      badge: "羽織るものが必要",
      body: ["ジャケットやセーターがおすすめです。朝晩は冷え込むため、羽織るものを持って出かけましょう。", ...extras].join(" "),
      tone: "caution",
    };
  }

  if (feel <= 20) {
    return {
      title: "服装提案",
      badge: gap >= 8 ? "朝晩は羽織りを" : "長袖シャツ1枚でOK",
      body: [
        gap >= 8
          ? "日中は長袖シャツで過ごせますが、朝晩はカーディガンや薄手の羽織りがあると快適です。"
          : "長袖シャツ1枚で過ごせそうです。薄手のカーディガンを一枚忍ばせると安心です。",
        ...extras,
      ].join(" "),
      tone: "ok",
    };
  }

  return {
    title: "服装提案",
    badge: "半袖で快適",
    body: ["半袖や涼しい服装で大丈夫そうです。日差しが強い時間は帽子もあると安心です。", ...extras].join(" "),
    tone: "warm",
  };
}

export function getUmbrellaAdvice(probability: number | null): LifestyleAdvice {
  const pop = probability ?? 0;

  if (pop >= 60) {
    return {
      title: "傘アラート",
      badge: "今日は傘が必須！",
      body: `降水確率は ${Math.round(pop)}% です。長傘を持って出かけてください。`,
      tone: "alert",
    };
  }

  if (pop >= 30) {
    return {
      title: "傘アラート",
      badge: "折りたたみ傘があると安心",
      body: `降水確率は ${Math.round(pop)}% です。急な雨に備えて折りたたみ傘を持っていきましょう。`,
      tone: "caution",
    };
  }

  return {
    title: "傘アラート",
    badge: "傘は不要",
    body: `降水確率は ${Math.round(pop)}% です。傘なしで出かけても大丈夫そうです。`,
    tone: "ok",
  };
}

export function getIndoorAdvice(input: {
  temperature: number;
  humidity: number;
  windSpeed: number;
}): LifestyleAdvice {
  const comfortableTemp = input.temperature >= 18 && input.temperature <= 24;
  const comfortableHumidity = input.humidity >= 40 && input.humidity <= 65;
  const breezy = input.windSpeed >= 5 && input.windSpeed <= 25;

  if (comfortableTemp && comfortableHumidity) {
    return {
      title: "室内快適ガイド",
      badge: breezy ? "外気爽快・窓開け日和" : "窓開け換気日和",
      body: breezy
        ? "いま窓を開けると心地いい風が入ります（外気爽快）。エアコンを止めて換気するチャンスです。"
        : "外気温と湿度が快適です。短時間でも窓を開けて換気すると室内がすっきりします。",
      tone: "ok",
    };
  }

  if (input.temperature <= 16) {
    return {
      title: "室内快適ガイド",
      badge: input.humidity >= 70 ? "暖房＋短時間換気" : "エアコン（暖房）推奨",
      body:
        input.humidity >= 70
          ? "外は肌寒く湿度も高めです。暖房で室内を温め、換気は短時間にしてください。"
          : "外は肌寒いため、エアコンの暖房や厚着で室内を温めましょう。換気するなら短時間が安心です。",
      tone: "cool",
    };
  }

  if (input.temperature >= 26 || (input.humidity >= 70 && input.temperature >= 22)) {
    return {
      title: "室内快適ガイド",
      badge: "エアコン（冷房・除湿）推奨",
      body: "外は蒸し暑いため、エアコンの冷房や除湿を活用するのがおすすめです。窓は短時間の換気にとどめましょう。",
      tone: "warm",
    };
  }

  if (input.humidity >= 70) {
    return {
      title: "室内快適ガイド",
      badge: "除湿を活用",
      body: "湿度が高めです。除湿や短時間の換気で室内を整えましょう。",
      tone: "caution",
    };
  }

  if (input.humidity < 40) {
    return {
      title: "室内快適ガイド",
      badge: "乾燥注意・加湿を",
      body: "空気が乾燥しています。加湿器や濡れタオルで湿度を整え、長時間の窓全開は控えめに。",
      tone: "caution",
    };
  }

  return {
    title: "室内快適ガイド",
    badge: "エアコン活用推奨",
    body: "外気は快適ゾーンから外れています。冷暖房や除湿を状況に合わせて使い、換気は短時間で行いましょう。",
    tone: "caution",
  };
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
