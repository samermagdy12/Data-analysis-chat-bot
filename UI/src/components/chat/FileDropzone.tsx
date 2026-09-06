import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mirrors ALLOWED_EXTENSIONS in app/routs/upload.py
const ACCEPTED = {
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
};

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  isUploading?: boolean;
  compact?: boolean;
}

export function FileDropzone({ onFileAccepted, isUploading, compact }: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFileAccepted(accepted[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface-2/50 text-center transition-colors",
          compact ? "p-5" : "p-10",
          isDragActive && "border-primary bg-primary/5",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {isDragActive ? (
              <UploadCloud className="h-6 w-6 text-primary" />
            ) : (
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            )}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">
            {isUploading
              ? "Uploading dataset…"
              : isDragActive
                ? "Drop the file to load it"
                : "Drag & drop a dataset, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">CSV, XLS or XLSX</p>
        </div>
      </div>
      {fileRejections.length > 0 && (
        <p className="mt-2 text-center text-xs text-destructive">
          Unsupported file type. Please upload a .csv, .xls, or .xlsx file.
        </p>
      )}
    </div>
  );
}
