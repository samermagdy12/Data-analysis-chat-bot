import { useState } from "react";
import { ChevronDown, ChevronRight, Table2 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  result: unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecordArray(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.length > 0 && value.every(isPlainObject);
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(4);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Table view for an array of uniform records, e.g. df.to_dict(orient="records") */
function RecordTable({ rows }: { rows: Record<string, unknown>[] }) {
  const columns = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface-2">
          <tr>
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/40">
              {columns.map((col) => (
                <td key={col} className="whitespace-nowrap border-b border-border/60 px-3 py-2 font-mono text-[0.82em]">
                  {formatCell(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Key/value table for flat dicts, e.g. value_counts(), missing_values, describe() columns */
function KeyValueTable({ obj }: { obj: Record<string, unknown> }) {
  const entries = Object.entries(obj);
  const allPrimitive = entries.every(([, v]) => !isPlainObject(v) && !Array.isArray(v));

  if (allPrimitive) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key} className="hover:bg-muted/40">
                <td className="w-1/2 whitespace-nowrap border-b border-border/60 bg-surface-2 px-3 py-2 font-medium text-muted-foreground">
                  {key}
                </td>
                <td className="border-b border-border/60 px-3 py-2 font-mono text-[0.85em]">
                  {formatCell(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Nested dict (e.g. describe() -> {column: {mean: .., std: ..}})
  const nestedKeys = Array.from(
    new Set(entries.flatMap(([, v]) => (isPlainObject(v) ? Object.keys(v) : [])))
  );
  if (nestedKeys.length && entries.every(([, v]) => isPlainObject(v))) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-2">
            <tr>
              <th className="border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
                &nbsp;
              </th>
              {entries.map(([key]) => (
                <th key={key} className="whitespace-nowrap border-b border-border px-3 py-2 text-left font-medium text-muted-foreground">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nestedKeys.map((nk) => (
              <tr key={nk} className="hover:bg-muted/40">
                <td className="whitespace-nowrap border-b border-border/60 bg-surface-2 px-3 py-2 font-medium text-muted-foreground">
                  {nk}
                </td>
                {entries.map(([key, value]) => (
                  <td key={key} className="whitespace-nowrap border-b border-border/60 px-3 py-2 font-mono text-[0.82em]">
                    {formatCell(isPlainObject(value) ? value[nk] : undefined)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <CodeBlock language="json" code={JSON.stringify(obj, null, 2)} />;
}

export function ResultView({ result }: ResultViewProps) {
  const [open, setOpen] = useState(true);

  if (result === null || result === undefined) return null;

  let body: React.ReactNode;
  if (typeof result === "number" || typeof result === "string" || typeof result === "boolean") {
    body = (
      <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm">
        {String(result)}
      </div>
    );
  } else if (isRecordArray(result)) {
    body = <RecordTable rows={result} />;
  } else if (isPlainObject(result)) {
    body = <KeyValueTable obj={result} />;
  } else if (Array.isArray(result)) {
    body = <CodeBlock language="json" code={JSON.stringify(result, null, 2)} />;
  } else {
    body = <CodeBlock language="json" code={JSON.stringify(result, null, 2)} />;
  }

  return (
    <div className="mt-2.5 animate-fade-in">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        )}
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Table2 className="h-3.5 w-3.5" />
        Result data
      </button>
      {open && <div className="mt-1.5">{body}</div>}
    </div>
  );
}
