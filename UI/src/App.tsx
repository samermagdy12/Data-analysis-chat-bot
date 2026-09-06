import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useChatStore } from "@/store/useChatStore";
import { useTheme } from "@/hooks/useTheme";
import { checkHealth } from "@/lib/api";
import { Database, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function AppShell() {
  useTheme();
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const createDraftChat = useChatStore((s) => s.createDraftChat);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? null,
    [chats, activeChatId]
  );

  const { data: backendOnline = null } = useQuery({
    queryKey: ["health"],
    queryFn: checkHealth,
    refetchInterval: 30_000,
  });

  // First-run convenience: if there are no chats at all, start one.
  useEffect(() => {
    if (chats.length === 0) createDraftChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 overflow-hidden">
        {activeChat ? (
          <ChatWindow chat={activeChat} backendOnline={backendOnline} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Database className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">No analysis selected</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Start a new analysis and upload a dataset to begin, or pick a previous one from
                the sidebar.
              </p>
            </div>
            <Button onClick={() => createDraftChat()} className="gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              New analysis
            </Button>
          </div>
        )}
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} backendOnline={backendOnline} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <AppShell />
        <Toaster richColors position="top-center" theme="system" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
