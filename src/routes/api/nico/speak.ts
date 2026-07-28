import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  text: z.string().min(1).max(4000),
  voice: z.string().max(40).optional(),
  speed: z.number().min(0.5).max(2).optional(),
  instructions: z.string().max(500).optional(),
});

export const Route = createFileRoute("/api/nico/speak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("AI gateway not configured", { status: 500 });

        const raw = await request.json().catch(() => null);
        const parsed = BodySchema.safeParse(raw);
        if (!parsed.success) return new Response("Invalid speech request", { status: 400 });
        const { text, voice, speed, instructions } = parsed.data;

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text.slice(0, 3000),
            voice: voice || "alloy",
            speed: speed ?? 1,
            instructions:
              instructions ||
              "Speak warmly and naturally, like a friendly personal assistant talking to a friend.",
            stream_format: "sse",
            response_format: "pcm",
          }),
        });

        if (!res.ok || !res.body) {
          const detail = await res.text().catch(() => "");
          console.error(`TTS failed [${res.status}]: ${detail}`);
          return new Response(detail || "TTS failed", { status: res.status });
        }

        return new Response(res.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
