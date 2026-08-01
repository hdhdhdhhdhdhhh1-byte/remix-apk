import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { aiClient } from "@/lib/ai/ai.server";

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
        if (!aiClient.isConfigured())
          return new Response("AI provider not configured", { status: 500 });

        const raw = await request.json().catch(() => null);
        const parsed = BodySchema.safeParse(raw);
        if (!parsed.success) return new Response("Invalid speech request", { status: 400 });
        const { text, voice, speed, instructions } = parsed.data;

        const res = await aiClient.speak({
          text,
          voice,
          speed,
          instructions:
            instructions ||
            "Speak warmly and naturally, like a friendly personal assistant talking to a friend.",
          streaming: true,
          format: "pcm",
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
