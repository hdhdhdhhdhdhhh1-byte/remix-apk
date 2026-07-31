import { createFileRoute } from "@tanstack/react-router";
import { aiClient } from "@/lib/ai/ai.server";
import { nicoRateLimiter } from "@/lib/rate-limit.server";

export const Route = createFileRoute("/api/nico/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const decision = nicoRateLimiter.check(ip);
        if (!decision.allowed) {
          return new Response("Too many requests", {
            status: 429,
            headers: { "Retry-After": Math.ceil(decision.retryAfterMs / 1000).toString() },
          });
        }

        if (!aiClient.isConfigured()) {
          return new Response("AI provider not configured", {
            status: 500,
          });
        }

        const formData = await request.formData();

        const audio = formData.get("audio");

        if (!(audio instanceof File)) {
          return new Response("Missing audio", {
            status: 400,
          });
        }

        const result = await aiClient.transcribe({
          file: audio,
        });

        if (!result.ok) {
          return new Response("Transcription failed", {
            status: 500,
          });
        }

        return Response.json({
          text: result.text,
        });
      },
    },
  },
});
