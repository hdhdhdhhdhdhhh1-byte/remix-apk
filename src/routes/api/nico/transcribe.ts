import { createFileRoute } from "@tanstack/react-router";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

export const Route = createFileRoute("/api/nico/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData();

        const audio = formData.get("audio");

        if (!(audio instanceof File)) {
          return new Response("Missing audio", {
            status: 400,
          });
        }

        const id = randomUUID();
        const input = join(tmpdir(), `nico-${id}.wav`);

        try {
          const buffer = Buffer.from(await audio.arrayBuffer());
          await writeFile(input, buffer);

          const text = await new Promise<string>((resolve, reject) => {
            let output = "";

            const whisper = spawn(
              "/data/data/com.termux/files/home/whisper.cpp/build/bin/whisper-cli",
              [
                "-m",
                "/data/data/com.termux/files/home/whisper.cpp/models/ggml-base.bin",
                "-f",
                input,
                "-l",
                "ar",
                "--no-timestamps",
                "--no-prints",
              ]
            );

            whisper.stdout.on("data", (data) => {
              output += data.toString();
            });

            whisper.stderr.on("data", (data) => {
              console.error("whisper:", data.toString());
            });

            whisper.on("close", (code) => {
              if (code === 0) {
                resolve(output.trim());
              } else {
                reject(new Error(`whisper exited ${code}`));
              }
            });
          });

          console.log("NICO TRANSCRIPT:", text);

          return Response.json({
            text,
            language: "ar",
          });

        } catch (error) {
          console.error(error);

          return new Response(
            error instanceof Error ? error.message : "Transcription failed",
            {
              status: 500,
            }
          );

        } finally {
          await unlink(input).catch(() => {});
        }
      },
    },
  },
});
