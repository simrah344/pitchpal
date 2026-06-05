import { Zap, Waves, Sparkles } from "lucide-react";

const CARDS = [
  {
    icon: Zap,
    title: "Real-time Feedback",
    desc: "Instant cues on posture, pace, and clarity while you speak.",
  },
  {
    icon: Waves,
    title: "Speech Analysis",
    desc: "Deep breakdowns of tone, filler words, and articulation.",
  },
  {
    icon: Sparkles,
    title: "Confidence Building",
    desc: "Track growth session by session and speak with presence.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 bg-gradient-vanilla">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-soft ring-1 ring-white">
              About PitchPal
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-bold text-primary leading-tight">
              What is <span className="text-gradient">PitchPal?</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              PitchPal is an AI-powered public speaking coach designed to help
              users practice speeches, improve confidence, maintain proper
              posture, and enhance communication skills through real-time
              intelligent feedback.
            </p>
          </div>

          <div className="grid gap-4">
            {CARDS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-white/80 backdrop-blur p-5 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth flex items-start gap-4 ring-1 ring-white"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-lg">{title}</h3>
                  <p className="mt-1 text-sm text-foreground/70 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
