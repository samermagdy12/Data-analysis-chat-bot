import { useState } from "react";
import { Download, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartImageProps {
  base64Png: string;
}

export function ChartImage({ base64Png }: ChartImageProps) {
  const [expanded, setExpanded] = useState(false);
  const src = `data:image/png;base64,${base64Png}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `chart-${Date.now()}.png`;
    link.click();
  };

  return (
    <>
      <div className="group relative mt-2.5 max-w-md overflow-hidden rounded-lg border border-border bg-white">
        <img src={src} alt="Generated chart" className="w-full" />
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setExpanded(true)}>
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="secondary" className="h-7 w-7" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8 animate-fade-in"
          onClick={() => setExpanded(false)}
        >
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-6 top-6"
            onClick={() => setExpanded(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <img src={src} alt="Generated chart enlarged" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </>
  );
}
