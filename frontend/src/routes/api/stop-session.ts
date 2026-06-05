import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stop-session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const res = await fetch("http://127.0.0.1:8000/stop-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const data = await res.json();

          console.log("FINAL BACKEND DATA:", data);

          return Response.json({
            summary: data.summary || "No summary available",

            overall_score: data.overall_score ?? 0,
            speech_score: data.speech_score ?? 0,
            body_score: data.body_score ?? 0,
            content_score: data.content_score ?? 0,
            confidence_score: data.confidence_score ?? 0,

            suggestions: Array.isArray(data.suggestions)
              ? data.suggestions
              : [],
          });
        } catch (err) {
          console.error("Stop-session error:", err);

          return Response.json({
            summary: "Something went wrong",

            overall_score: 0,
            speech_score: 0,
            body_score: 0,
            content_score: 0,
            confidence_score: 0,

            suggestions: [],
          });
        }
      },
    },
  },
});