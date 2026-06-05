import { Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar({ onStart }: { onStart: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto max-w-6xl px-6 py-4">
        <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-soft">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Mic2 className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold text-primary">
              PitchPal
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-primary/80">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#topic" className="hover:text-primary transition-colors">Topic</a>
            <a href="#practice" className="hover:text-primary transition-colors">Practice</a>
            <a href="#feedback" className="hover:text-primary transition-colors">Feedback</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
          </nav>
          <Button variant="hero" size="default" onClick={onStart}>
            Start
          </Button>
        </div>
      </div>
    </header>
  );
}
