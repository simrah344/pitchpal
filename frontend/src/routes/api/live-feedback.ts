import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/api/live-feedback")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch("http://127.0.0.1:8000/live-feedback");
          const data = await res.json();

          console.log("BACKEND DATA:", data);

          return Response.json({
            text: data.transcript || "",

            posture_status: data.posture || "Unknown",
            eye_contact: data.eye_contact || "Unknown",
            confidence: data.confidence || "Unknown",
            clarity: data.clarity || "Unknown",

            speed: data.speed || "Unknown", // 

            fillers: data.filler_words || 0,
            wps: 0, 
          });
        } catch (err) {
          console.error("Backend error:", err);

          return Response.json({
            text: "",
            posture_status: "Error",
            eye_contact: "Error",
            confidence: "Error",
            clarity: "Error",
            speed: "Error",
            fillers: 0,
            wps: 0,
          });
        }
      },
    },
  },
});