import { createFileRoute } from "@tanstack/react-router";
import { aiClient } from "@/lib/ai/ai.client";

/** Arabic script detection — used when the provider omits a language. */
function detectLanguage(text: string, hint?: string): string {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[A-Za-z]/.test(text)) return "en";
  return hint || "ar";
}

/** Average log-probability → a rough 0..1 confidence. */
function toConfidence(logprobs?: { logprob?: number }[]): number | undefined {
  if (!logprobs?.length) return undefined;
  const values = logprobs.map((l) => l.logprob ?? 0).filter((v) => Number.isFinite(v));
  if (!values.length) return undefined;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(Math.min(1, Math.max(0, Math.exp(avg))) * 100) / 100;
}

export const Route = createFileRoute("/api/nico/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!aiClient.isConfigured()) return new Response("AI provider not configured", { status: 500 });

        const form = await request.formData();
        const audio = form.get("audio");
        if (!(audio instanceof File) || audio.size === 0) {
          return new Response("Missing audio file", { status: 400 });
        }
        if (audio.size > 20 * 1024 * 1024) {
          return new Response("Audio too large", { status: 413 });
        }

        // Language hint biases detection but never forces it: Arabic speakers
        // frequently mix in English words and dialect phrasing.
        const rawHint = form.get("language");
        const hint = typeof rawHint === "string" && /^(ar|en)$/.test(rawHint) ? rawHint : undefined;
        const rawDuration = form.get("duration_ms");
        const clientDuration =
          typeof rawDuration === "string" && /^\d{1,7}$/.test(rawDuration)
            ? Number(rawDuration)
            : undefined;

        const res = await aiClient.transcribe({
          file: audio,
          language: hint,
          prompt:
            "المتحدث قد يستخدم العربية الفصحى أو لهجة خليجية أو مصرية أو شامية، وقد يخلط كلمات إنجليزية. اكتب النص كما نُطق.",
        });

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error(`STT failed [${res.status}]: ${detail}`);
          return new Response(detail || "Transcription failed", { status: res.status });
        }

        const data = (await res.json()) as {
          text?: string;
          language?: string;
          duration?: number;
          logprobs?: { logprob?: number }[];
        };
        const text = data.text ?? "";
        return Response.json({
          text,
          language: data.language ?? detectLanguage(text, hint),
          durationMs: data.duration ? Math.round(data.duration * 1000) : clientDuration,
          confidence: toConfidence(data.logprobs),
        });
      },
    },
  },
});
