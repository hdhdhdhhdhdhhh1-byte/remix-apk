/**
 * Thin adapter - FIXED FOR TERMUX
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
  const fs = await import("fs/promises");
  const { spawn } = await import("child_process");
  const output = `/data/data/com.termux/files/home/remix-of-90159487/nico.wav`;
  const safe = opts.text.replace(/"/g,'').replace(/`/g,'').slice(0,400);
  
  await new Promise<void>((resolve, reject) => {
    const espeak = spawn("espeak", ["-v", "ar", "-s", "125", "-w", output, safe]);
    espeak.on("close", (code) => code === 0 ? resolve() : reject(new Error(`espeak ${code}`)));
    espeak.on("error", (e) => reject(e));
  });

  const audio = await fs.readFile(output);
  return new Response(audio, { headers: { "Content-Type": "audio/wav" } });
}
