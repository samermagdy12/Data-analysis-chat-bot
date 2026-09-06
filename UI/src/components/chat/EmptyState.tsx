import { BarChart3, Sigma, Table, Wand2 } from "lucide-react";
import { FileDropzone } from "./FileDropzone";

const SUGGESTIONS = [
  { icon: Table, text: "Give me a summary of this dataset" },
  { icon: Sigma, text: "What columns have missing values?" },
  { icon: BarChart3, text: "Plot the correlation heatmap" },
  { icon: Wand2, text: "Show me the distribution of a numeric column" },
];

interface EmptyStateProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
}

export function EmptyState({ onFileAccepted, isUploading }: EmptyStateProps) {
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Load a dataset to begin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload a CSV or Excel file and the analyst will answer questions using descriptive
          statistics, missing-value checks, value counts, custom Python, and charts — grounded
          only in your data.
        </p>
      </div>

      <FileDropzone onFileAccepted={onFileAccepted} isUploading={isUploading} />

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2/60 px-3 py-2.5 text-left text-xs text-muted-foreground"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
            {text}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Available once a dataset is loaded — these become real questions you can ask below.
      </p>
    </div>
  );
}
