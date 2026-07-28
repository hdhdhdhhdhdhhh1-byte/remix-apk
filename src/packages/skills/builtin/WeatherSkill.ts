import type { Skill } from "../../shared/types";

/**
 * Live weather via Open-Meteo (keyless). Requires location permission,
 * falls back to a coarse default when the user grants but geolocation fails.
 */
export const WeatherSkill: Skill = {
  id: "weather",
  name: "الطقس",
  description: "يجلب حالة الطقس الحالية لموقع المستخدم",
  intents: ["weather"],
  permissions: ["location"],
  async execute() {
    const coords = await getCoords();
    if (!coords) return { ok: false, speech: "", error: "no_location" };
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,wind_speed_10m`,
      );
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        current: { temperature_2m: number; wind_speed_10m: number };
      };
      return {
        ok: true,
        speech: `درجة الحرارة عندك الآن ${Math.round(data.current.temperature_2m)} درجة والرياح ${Math.round(data.current.wind_speed_10m)} كم بالساعة.`,
        data: data.current as unknown as Record<string, unknown>,
      };
    } catch (e) {
      return { ok: false, speech: "", error: String(e) };
    }
  },
};

function getCoords(): Promise<{ lat: number; lon: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => resolve(null),
      { timeout: 6000 },
    );
  });
}
