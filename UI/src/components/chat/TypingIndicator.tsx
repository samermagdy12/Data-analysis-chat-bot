import { Sparkles } from "lucide-react";

export function TypingIndicator({ label = "Analyzing" }: { label?: string }) {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:-0.32s]" />
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary [animation-delay:-0.16s]" />
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
