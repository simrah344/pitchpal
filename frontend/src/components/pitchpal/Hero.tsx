import { Button } from "@/components/ui/button";
import { Mic, Sparkles, Shuffle } from "lucide-react";

export function Hero({
  onStart,
  onGenerate,
}: {
  onStart: () => void;
  onGenerate: () => void;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32 bg-gradient-hero text-primary-foreground">
      {/* Decorative blurred orbs */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/20 blur-3xl animate-float" />
        <div
          className="absolute top-40 -right-20 h-96 w-96 rounded-full bg-[oklch(0.93_0.09_95)]/30 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative container mx-auto max-w-5xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30 px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-soft mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          AI-Powered Speaking Coach
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-primary-foreground animate-fade-in">
          Public Speaking{" "}
          <span className="bg-gradient-to-r from-[oklch(0.97_0.06_95)] to-[oklch(0.88_0.11_92)] bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-primary-foreground/85 leading-relaxed animate-fade-in">
          Practice speeches on any topic and receive instant AI feedback on
          confidence, posture, clarity, and delivery.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in">
          <Button variant="hero" size="xl" onClick={onStart}>
            <Mic className="h-5 w-5" />
            Start Practicing
          </Button>
          <Button variant="white" size="xl" onClick={onGenerate}>
            <Shuffle className="h-5 w-5" />
            Generate Topic
          </Button>
        </div>
      </div>
    </section>
  );
}
