import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/pitchpal/Navbar";
import { Hero } from "@/components/pitchpal/Hero";
import { About } from "@/components/pitchpal/About";
import { TopicSelector } from "@/components/pitchpal/TopicSelector";
import { LiveSpeaking } from "@/components/pitchpal/LiveSpeaking";
import { Feedback } from "@/components/pitchpal/Feedback";
import { Features } from "@/components/pitchpal/Features";
import { Footer } from "@/components/pitchpal/Footer";
import type { FinalReport } from "@/components/pitchpal/LiveSpeaking";

const RANDOM_TOPICS = [
  "The future of artificial intelligence in everyday life",
  "Why curiosity is the most underrated skill",
  "How small habits create extraordinary results",
  "The power of storytelling in leadership",
  "Climate change and the role of young innovators",
  "What makes a city truly livable?",
  "The art of saying no without guilt",
  "How music shapes the way we think",
  "Lessons I learned from failure",
  "If I could redesign the education system…",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PitchPal — AI Public Speaking Coach" },
      {
        name: "description",
        content:
          "Practice public speaking on any topic and receive real-time AI feedback on confidence, posture, clarity, and delivery.",
      },
      { property: "og:title", content: "PitchPal — AI Public Speaking Coach" },
      {
        property: "og:description",
        content:
          "Boost your public speaking with real-time AI feedback on delivery, confidence, and body language.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [topic, setTopic] = useState("");
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const generateTopic = () => {
    const t = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    setTopic(t);
    scrollTo("topic");
  };

  return (
    <div className="min-h-screen">
      <Navbar onStart={() => scrollTo("topic")} />
      <main>
        <Hero
          onStart={() => scrollTo("topic")}
          onGenerate={generateTopic}
        />
        <About />
        <TopicSelector topic={topic} setTopic={setTopic} />
        <LiveSpeaking topic={topic} onAnalyze={() => scrollTo("feedback")} onFinalReport={setFinalReport} />
        <Feedback report={finalReport} />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
