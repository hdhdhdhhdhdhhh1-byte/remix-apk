/**
 * Streaming text-to-speech. PCM chunks arrive over SSE and are scheduled on
 * an AudioContext so Nico starts speaking before generation finishes.
 */

/** Voice shaping forwarded to the speech endpoint. */
export interface SpeakOptions {
  voice?: string;
  speed?: number;
  instructions?: string;
}

export class TextToSpeech {
  private ctx: AudioContext | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private analyser: AnalyserNode | null = null;

  constructor(private readonly endpoint = "/api/nico/speak") {}

  level(): number {
    if (!this.analyser) return 0;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    let peak = 0;
    for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
    return peak;
  }

  async speak(text: string, options: string | SpeakOptions = {}): Promise<void> {
    const opts: SpeakOptions = typeof options === "string" ? { voice: options } : options;

    if (!text.trim()) return;
    this.stop();
    const ctx = new AudioContext({ sampleRate: 24000 });
    this.ctx = ctx;
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.connect(ctx.destination);
    this.analyser = analyser;

    let playhead = 0;
    let pending = new Uint8Array(0);

    const push = (incoming: Uint8Array) => {
      const bytes = new Uint8Array(pending.length + incoming.length);
      bytes.set(pending);
      bytes.set(incoming, pending.length);
      const usable = bytes.length - (bytes.length % 2);
      pending = bytes.slice(usable);
      if (!usable) return;
      const pcm = new Int16Array(bytes.buffer, 0, usable / 2);
      const floats = Float32Array.from(pcm, (s) => s / 32768);
      const buffer = ctx.createBuffer(1, floats.length, 24000);
      buffer.copyToChannel(floats, 0);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(analyser);
      playhead = playhead === 0 ? ctx.currentTime + 0.05 : Math.max(playhead, ctx.currentTime);
      src.start(playhead);
      playhead += buffer.duration;
      this.sources.add(src);
      src.onended = () => this.sources.delete(src);
    };

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: opts.voice ?? "alloy",
        speed: opts.speed,
        instructions: opts.instructions,
      }),
    });
    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      throw new Error(`TTS failed [${res.status}]: ${detail}`);
    }

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      const parts = buf.split("\n\n");
      buf = parts.pop() ?? "";
      for (const part of parts) {
        const line = part.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        const payloadText = line.slice(5).trim();
        if (!payloadText || payloadText === "[DONE]") continue;
        let payload: { type?: string; audio?: string };
        try {
          payload = JSON.parse(payloadText);
        } catch {
          continue;
        }
        if (payload.type !== "speech.audio.delta" || !payload.audio) continue;
        const bin = atob(payload.audio);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        push(bytes);
      }
    }

    const remaining = Math.max(0, playhead - ctx.currentTime);
    await new Promise((r) => setTimeout(r, remaining * 1000 + 120));
  }

  stop() {
    this.sources.forEach((s) => {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    });
    this.sources.clear();
    this.analyser = null;
    this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}
