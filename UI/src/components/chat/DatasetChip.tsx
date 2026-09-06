import { FileSpreadsheet } from "lucide-react";
import type { DatasetInfo } from "@/lib/types";
import { formatBytesFromRowsCols } from "@/lib/utils";

export function DatasetChip({ dataset }: { dataset: DatasetInfo }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 py-1 pl-1 pr-3 text-xs">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
        <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
      </span>
      <span className="font-medium">{dataset.filename}</span>
      <span className="text-muted-foreground">·</span>
      <span className="font-mono text-muted-foreground">
        {formatBytesFromRowsCols(dataset.rows, dataset.columns)}
      </span>
    </div>
  );
}
