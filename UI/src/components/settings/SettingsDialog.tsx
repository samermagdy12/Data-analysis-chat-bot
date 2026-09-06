import { Moon, Sun, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/store/useChatStore";
import { useTheme } from "@/hooks/useTheme";
import { API_BASE_URL } from "@/lib/api";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backendOnline: boolean | null;
}

export function SettingsDialog({ open, onOpenChange, backendOnline }: SettingsDialogProps) {
  const { theme, toggleTheme } = useTheme();
  const clearAllChats = useChatStore((s) => s.clearAllChats);
  const chatCount = useChatStore((s) => s.chats.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Preferences are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Backend connection</p>
              <p className="break-all font-mono text-xs text-muted-foreground">{API_BASE_URL}</p>
            </div>
            {backendOnline === null ? (
              <Badge variant="secondary">Checking…</Badge>
            ) : backendOnline ? (
              <Badge variant="success">Online</Badge>
            ) : (
              <Badge variant="destructive">Offline</Badge>
            )}
          </div>
          <p className="-mt-3 text-xs text-muted-foreground">
            Set via <code className="rounded bg-muted px-1 py-0.5 font-mono">VITE_API_BASE_URL</code> in
            your <code className="rounded bg-muted px-1 py-0.5 font-mono">.env</code> file, then restart
            the dev server.
          </p>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Clear local chat history</p>
              <p className="text-xs text-muted-foreground">
                Removes all {chatCount} saved {chatCount === 1 ? "analysis" : "analyses"} from this
                browser. This does not affect any data on the server.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => {
                clearAllChats();
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
