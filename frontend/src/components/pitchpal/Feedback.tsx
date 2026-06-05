import {
  Activity,
  Smile,
  User,
  FileText,
  Trophy,
  Lightbulb,
} from "lucide-react";
import type { FinalReport } from "./LiveSpeaking";

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-gradient-primary transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

const DEFAULT_REPORT: FinalReport = {
  summary:
    "You maintained good posture but need better eye contact. Speech clarity was strong and confidence was moderate. Your content was well-structured with a memorable closing.",
  overall_score: 84,
  body_score: 82,
  speech_score: 86,
  content_score: 90,
  confidence_score: 78,
  suggestions: [
    "Hold eye contact with the camera for 3–5 seconds at a time.",
    "Slow down slightly during your opening sentence.",
    "Replace filler words (um, like) with intentional pauses.",
    "Use open hand gestures to emphasize key points.",
  ],
};

export function Feedback({ report }: { report: FinalReport | null }) {
  const data = report || DEFAULT_REPORT;
  const isLive = !!report;

  const cards = [
    { icon: User, title: "Body Language", score: data.body_score },
    { icon: Activity, title: "Speech Delivery", score: data.speech_score },
    { icon: FileText, title: "Content Quality", score: data.content_score },
    { icon: Smile, title: "Confidence Analysis", score: data.confidence_score },
  ];

  return (
    <section id="feedback" className="py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Final Feedback Summary
          </h2>
          <p className="mt-3 text-muted-foreground">
            {isLive
              ? "Here's your personalized performance report."
              : "Sample report — record a session above to generate yours."}
          </p>
        </div>

        {/* Summary paragraph */}
        <div className="glass rounded-3xl p-6 md:p-8 shadow-soft mb-8">
          <p className="text-lg leading-relaxed text-foreground/90">
            <span className="font-semibold text-primary">Summary — </span>
            {data.summary}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overall — large card */}
          <div className="lg:row-span-2 lg:col-span-1 rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-80">
                <Trophy className="h-4 w-4" />
                Overall Performance
              </div>
              <div className="mt-6 font-display text-7xl font-bold leading-none">
                {data.overall_score}
                <span className="text-3xl opacity-70">/100</span>
              </div>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                {data.overall_score >= 80
                  ? "Excellent performance. You're delivering with clarity and presence — keep refining your gestures for full impact."
                  : data.overall_score >= 60
                    ? "Good effort! Focus on the suggestions below to take your delivery to the next level."
                    : "Keep practicing! Review the feedback below and try again."}
              </p>
            </div>
            <div className="mt-8">
              <div className="text-xs uppercase tracking-wider opacity-70 mb-2">
                Progress
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${data.overall_score}%` }}
                />
              </div>
            </div>
          </div>

          {cards.map(({ icon: Icon, title, score }) => (
            <div
              key={title}
              className="glass rounded-3xl p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-3xl font-bold text-primary">
                  {score}
                </div>
              </div>
              <h3 className="font-semibold text-primary text-lg">{title}</h3>
              <div className="mt-4">
                <ScoreBar value={score} />
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="mt-8 glass rounded-3xl p-6 md:p-8 shadow-soft">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-primary">
              Suggestions for Improvement
            </h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white/70 px-4 py-3 ring-1 ring-white/60 text-sm text-foreground/90"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
