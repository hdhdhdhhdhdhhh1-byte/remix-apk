import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    spa: {
      entry: "index.html",
    },
    server: {
      entry: "server",
    },
    prerender: {
      routes: [],
      enabled: false,
    },
  },
});
