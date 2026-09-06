import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");
            const codeString = String(children).replace(/\n$/, "");
            if (isInline) {
              return <CodeBlock inline language="" code={codeString} />;
            }
            return <CodeBlock language={match?.[1] ?? ""} code={codeString} />;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          a({ children, ...props }) {
            return (
              <a {...props} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-surface-2">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border-b border-border/60 px-3 py-2 font-mono text-[0.85em]">{children}</td>;
          },
          ul({ children }) {
            return <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>;
          },
          p({ children }) {
            return <p className="leading-relaxed [&:not(:first-child)]:mt-2.5">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="mt-4 font-display text-lg font-semibold">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mt-4 font-display text-base font-semibold">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mt-3 font-display text-sm font-semibold">{children}</h3>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2 border-l-2 border-accent/50 pl-3 text-muted-foreground">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
