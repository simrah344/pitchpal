import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shuffle, Lightbulb } from "lucide-react";

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

export function TopicSelector({
  topic,
  setTopic,
}: {
  topic: string;
  setTopic: (t: string) => void;
}) {
  const [generated, setGenerated] = useState<string | null>(null);

  const generate = () => {
    const t = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    setGenerated(t);
    setTopic(t);
  };

  return (
    <section id="topic" className="py-16">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            Pick Your Topic
          </h2>
          <p className="mt-3 text-muted-foreground">
            Choose something you care about — or let us surprise you.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 shadow-elegant">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setGenerated(null);
              }}
              placeholder="Enter your own topic..."
              className="h-14 text-base rounded-xl bg-white/80 border-white/60 focus-visible:ring-primary"
            />
            <Button variant="hero" size="lg" onClick={generate} className="h-14">
              <Shuffle className="h-5 w-5" />
              Generate Random Topic
            </Button>
          </div>

          {generated && (
            <div className="mt-6 rounded-2xl bg-gradient-primary p-[1px] shadow-glow animate-scale-in">
              <div className="rounded-2xl bg-white/95 px-6 py-5 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow">
                    Your Topic
                  </div>
                  <p className="mt-1 text-lg font-semibold text-primary">
                    {generated}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
