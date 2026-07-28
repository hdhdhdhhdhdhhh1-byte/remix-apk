import { createFileRoute } from "@tanstack/react-router";
import { aiClient, type ChatOptions } from "@/lib/ai/ai.client";

const SYSTEM = `أنت "نيكو"، مساعد شخصي صوتي.
- تتحدث بالعربية بلهجة طبيعية وودودة، وبالإنجليزية إذا خاطبك المستخدم بها.
- ردودك قصيرة (جملة إلى ثلاث جمل) لأنها تُنطق صوتياً، بلا رموز أو markdown أو قوائم.
- أنت تتحدث ولا ترسل رسائل مكتوبة.
- استخدم المعلومات المحفوظة عن المستخدم بشكل طبيعي.
أعد دائماً JSON فقط بالشكل:
{"speech":"...","intent":"greeting|smalltalk|question|reminder|weather|calendar|search|smart_home|memory_store|memory_recall|unknown","memories":[{"key":"...","value":"...","kind":"profile|preference|habit|fact"}]}
ضع في memories فقط المعلومات الشخصية الجديدة الجديرة بالحفظ الدائم، وإلا اتركها فارغة.`;

interface ThinkBody {
  transcript?: string;
  history?: { role: string; content: string }[];
  memoryDigest?: string;
  skillFindings?: string[];
  userName?: string;
  systemPrompt?: string;
}

export const Route = createFileRoute("/api/nico/think")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!aiClient.isConfigured()) return new Response("AI provider not configured", { status: 500 });

        const body = (await request.json().catch(() => null)) as ThinkBody | null;
        const transcript = body?.transcript?.trim();
        if (!transcript) return new Response("Missing transcript", { status: 400 });

        const systemPrompt = body?.systemPrompt?.trim() || SYSTEM;
        const context = [
          body?.memoryDigest ? `ما أعرفه عن المستخدم:\n${body.memoryDigest}` : "",
          body?.skillFindings?.length
            ? `نتائج المهارات المنفذة:\n${body.skillFindings.join("\n")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n");

        const messages: ChatOptions["messages"] = [
          { role: "system", content: systemPrompt },
          ...(context ? [{ role: "system" as const, content: context }] : []),
          ...(body?.history ?? []).slice(-10).map((t) => ({
            role: t.role === "nico" ? ("assistant" as const) : ("user" as const),
            content: t.content,
          })),
          { role: "user" as const, content: transcript },
        ];

        const res = await aiClient.chat({ messages, jsonMode: true });

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error(`Reasoning failed [${res.status}]: ${detail}`);
          return new Response(detail || "Reasoning failed", { status: res.status });
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const raw = data.choices?.[0]?.message?.content ?? "{}";
        try {
          const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, ""));
          return Response.json({
            speech: String(parsed.speech ?? ""),
            intent: parsed.intent ?? null,
            memories: Array.isArray(parsed.memories) ? parsed.memories.slice(0, 5) : [],
          });
        } catch {
          return Response.json({ speech: raw, intent: null, memories: [] });
        }
      },
    },
  },
});
