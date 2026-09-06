import { Sparkles, User, AlertTriangle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ResultView } from "./ResultView";
import { ChartImage } from "./ChartImage";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="flex max-w-[80%] items-start gap-3">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-[0.925rem] leading-relaxed text-primary-foreground">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex w-full max-w-[85%] items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            message.isError ? "bg-destructive/15" : "bg-primary/15"
          )}
        >
          {message.isError ? (
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        <div
          className={cn(
            "min-w-0 flex-1 rounded-2xl rounded-tl-sm border px-4 py-3 text-[0.925rem]",
            message.isError
              ? "border-destructive/30 bg-destructive/[0.06]"
              : "border-l-2 border-l-primary/60 border-y-border border-r-border bg-card"
          )}
        >
          {message.content && <MarkdownRenderer content={message.content} />}
          {message.chart && <ChartImage base64Png={message.chart} />}
          {message.result !== undefined && <ResultView result={message.result} />}
        </div>
      </div>
    </div>
  );
}
