import { Mic2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[oklch(0.93_0.09_95)] text-primary">
            <Mic2 className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-lg">PitchPal</span>
        </div>
        <p className="text-sm text-primary-foreground/85 text-center">
          PitchPal — Your AI Public Speaking Coach
        </p>
        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} PitchPal
        </p>
      </div>
    </footer>
  );
}
