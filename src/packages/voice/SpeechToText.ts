import { VoiceActivityDetector, type VadOptions } from "./VoiceActivityDetector";

/**
 * Browser microphone capture → 16 kHz mono WAV → server transcription.
 * WAV keeps every chunk decodable across Safari/Chrome/Firefox.
 */

/** Transcript plus the metadata stored on the message and voice session. */
export interface TranscriptionResult {
  text: string;
  /** Detected (or hinted) language: "ar" | "en" | provider code. */
  language: string;
  /** Recorded audio length in milliseconds. */
  durationMs: number;
  /** 0..1 model confidence, when the provider reports it. */
  confidence?: number;
}

export interface SttHandle {
  /** True once the detector heard actual speech in this utterance. */
  hasSpeech: () => boolean;
  /** `hint` biases detection towards the user's preferred language. */
  stop: (hint?: string) => Promise<TranscriptionResult>;
  cancel: () => void;
  level: () => number;
}

export interface SttStartOptions {
  /** Enable automatic stop on trailing silence. */
  vad?: VadOptions | false;
  /** Called when the detector decides the utterance is complete. */
  onAutoStop?: (reason: "silence" | "timeout") => void;
  onSpeechStart?: () => void;
}

export class SpeechToText {
  constructor(private readonly endpoint = "/api/nico/transcribe") {}

  async start(options: SttStartOptions = {}): Promise<SttHandle> {
    const startedAt = Date.now();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array[] = [];
    let stopped = false;

    processor.onaudioprocess = (e) => {
      if (stopped) return;
      chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };
    source.connect(analyser);
    source.connect(processor);
    processor.connect(ctx.destination);

    const levelData = new Uint8Array(analyser.frequencyBinCount);
    const readLevel = () => {
      analyser.getByteTimeDomainData(levelData);
      let peak = 0;
      for (const v of levelData) peak = Math.max(peak, Math.abs(v - 128) / 128);
      return peak;
    };

    // Voice activity detection: ends the utterance on trailing silence so the
    // user never has to press stop, and caps runaway recordings.
    let vad: VoiceActivityDetector | null = null;
    if (options.vad !== false) {
      vad = new VoiceActivityDetector({
        ...(options.vad ?? {}),
        onSpeechStart: options.onSpeechStart,
        onSpeechEnd: (reason) => options.onAutoStop?.(reason),
      });
      vad.attach(readLevel);
    }

    const teardown = async () => {
      stopped = true;
      vad?.stop();
      processor.disconnect();
      analyser.disconnect();
      source.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      const rate = ctx.sampleRate;
      await ctx.close();
      return rate;
    };

    return {
      level: readLevel,
      hasSpeech: () => vad?.hasSpeech ?? true,
      cancel: () => void teardown(),
      stop: async (hint?: string) => {
        const durationMs = Date.now() - startedAt;
        const rate = await teardown();
        const wav = encodeWav(chunks, rate);
        if (wav.size < 2048) throw new Error("empty_recording");
        const form = new FormData();
        form.append("audio", wav, "recording.wav");
        if (hint) form.append("language", hint);
        form.append("duration_ms", String(durationMs));
        const res = await fetch(this.endpoint, { method: "POST", body: form });
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          throw new Error(`Transcription failed [${res.status}]: ${detail}`);
        }
        const data = (await res.json()) as {
          text?: string;
          language?: string;
          confidence?: number;
        };
        return {
          text: (data.text ?? "").trim(),
          language: data.language ?? hint ?? "ar",
          durationMs,
          confidence: data.confidence,
        } satisfies TranscriptionResult;
      },
    };
  }
}

/** Downsamples to 16 kHz and writes a standard 16-bit mono WAV. */
export function encodeWav(chunks: Float32Array[], sampleRate: number, target = 16000): Blob {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  const ratio = sampleRate / target;
  const outLength = Math.floor(merged.length / ratio);
  const samples = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const s = Math.max(-1, Math.min(1, merged[Math.floor(i * ratio)] ?? 0));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, target, true);
  view.setUint32(28, target * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  new Int16Array(buffer, 44).set(samples);
  return new Blob([buffer], { type: "audio/wav" });
}
