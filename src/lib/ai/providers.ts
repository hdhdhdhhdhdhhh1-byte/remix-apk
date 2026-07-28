/**
 * Thin adapter that speaks the OpenAI-compatible REST shape used by every
 * major provider (OpenAI, OpenRouter, Groq, LiteLLM, self-hosted vLLM …).
 *
 * If a project later needs a native Anthropic / Gemini SDK, add another
 * adapter here and switch on config.provider inside ai.client.ts.
 */

import type { AiConfig } from "./ai.config";

type Headers = Record<string, string>;

function authHeaders(cfg: AiConfig, extra: Headers = {}): Headers {
  return {
    Authorization: `Bearer ${cfg.apiKey}`,
    ...extra,
  };
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  jsonMode?: boolean;
}

export async function chat(cfg: AiConfig, opts: ChatOptions): Promise<Response> {
  return fetch(`${cfg.baseUrl}/chat/completions`, {
    method: "POST",
    headers: authHeaders(cfg, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      model: opts.model || cfg.chatModel,
      messages: opts.messages,
      ...(opts.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
}

export interface TranscribeOptions {
  file: File;
  language?: string;
  prompt?: string;
  model?: string;
}

export async function transcribe(cfg: AiConfig, opts: TranscribeOptions): Promise<Response> {
  const form = new FormData();
  form.append("model", opts.model || cfg.sttModel);
  form.append("file", opts.file, opts.file.name || "recording.wav");
  if (opts.prompt) form.append("prompt", opts.prompt);
  if (opts.language) form.append("language", opts.language);
  return fetch(`${cfg.baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: authHeaders(cfg),
    body: form,
  });
}

export interface SpeakOptions {
  text: string;
  voice?: string;
  speed?: number;
  instructions?: string;
  model?: string;
  streaming?: boolean;
  format?: string;
}

export async function speak(cfg: AiConfig, opts: SpeakOptions): Promise<Response> {
  return fetch(`${cfg.baseUrl}/audio/speech`, {
    method: "POST",
    headers: authHeaders(cfg, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      model: opts.model || cfg.ttsModel,
      input: opts.text.slice(0, 3000),
      voice: opts.voice || cfg.ttsVoice,
      speed: opts.speed ?? 1,
      ...(opts.instructions ? { instructions: opts.instructions } : {}),
      ...(opts.streaming ? { stream_format: "sse" } : {}),
      ...(opts.format ? { response_format: opts.format } : {}),
    }),
  });
}