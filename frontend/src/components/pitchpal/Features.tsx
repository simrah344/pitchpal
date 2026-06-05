import { Brain, FileText, Shuffle, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Real-Time Analysis",
    desc: "Instant feedback on your tone, pace, and clarity as you speak.",
  },
  {
    icon: FileText,
    title: "Transcript Generation",
    desc: "Automatic speech-to-text so you can review every word you said.",
  },
  {
    icon: Shuffle,
    title: "Topic Generator",
    desc: "Stay sharp with fresh, unexpected prompts every time you practice.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    desc: "Visual scores and trends to track your speaking growth over time.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Everything You Need to Speak Better
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            A focused toolkit built around one goal — making you a more
            confident public speaker.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft group-hover:scale-110 transition-smooth">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-primary text-lg">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
