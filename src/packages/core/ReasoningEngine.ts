import type { ConversationTurn, IntentName } from "../shared/types";

export interface ReasoningInput {
  transcript: string;
  history: ConversationTurn[];
  memoryDigest: string;
  skillFindings: string[];
  userName?: string;
  systemPrompt?: string;
}

export interface ReasoningOutput {
  speech: string;
  intent: IntentName | null;
  memories: { key: string; value: string; kind: "profile" | "preference" | "habit" | "fact" | "event" }[];
}

/**
 * LLM-backed reasoning. Runs against the server route so no key touches
 * the browser. Falls back to a deterministic reply if the call fails.
 */
export class ReasoningEngine {
  constructor(private readonly endpoint = "/api/nico/think") {}

  async reason(input: ReasoningInput): Promise<ReasoningOutput> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Reasoning failed [${res.status}]: ${detail}`);
    }
    const data = (await res.json()) as Partial<ReasoningOutput>;
    return {
      speech: data.speech?.trim() || "ما قدرت أفهم الطلب، جرّب تعيد صياغته.",
      intent: data.intent ?? null,
      memories: data.memories ?? [],
    };
  }
}
