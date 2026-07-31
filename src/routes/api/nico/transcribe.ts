import { createServerFileRoute } from '@tanstack/react-start'
export const ServerRoute = createServerFileRoute('/api/nico/transcribe').methods({
  POST: async ({ request }) => {
    return new Response(JSON.stringify({ text: "ok" }), { headers: { "Content-Type": "application/json" } })
  }
})
