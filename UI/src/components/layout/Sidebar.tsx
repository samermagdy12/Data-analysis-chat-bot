import { useMemo, useState } from "react";
import {
  MessageSquarePlus,
  Search,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Database,
  MoreHorizontal,
  Pencil,
  Sun,
  Moon,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { cn, groupByRecency, timeAgo, truncate, formatBytesFromRowsCols } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteServerSession } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ collapsed, onToggleCollapsed, onOpenSettings }: SidebarProps) {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const createDraftChat = useChatStore((s) => s.createDraftChat);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const renameChat = useChatStore((s) => s.renameChat);
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return chats;
    const q = query.toLowerCase();
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.dataset?.filename.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [chats, query]);

  const grouped = useMemo(() => groupByRecency(filtered), [filtered]);

  const handleNewChat = () => {
    createDraftChat();
  };

  const handleDelete = (chatId: string) => {
    deleteServerSession(chatId);
    deleteChat(chatId);
  };

  const commitRename = (chatId: string) => {
    if (renameValue.trim()) renameChat(chatId, renameValue.trim());
    setRenamingId(null);
  };

  if (collapsed) {
    return (
      <div className="flex h-full w-[60px] flex-col items-center gap-2 border-r border-border bg-surface py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onToggleCollapsed} aria-label="Expand sidebar">
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label="New chat">
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">New analysis</TooltipContent>
        </Tooltip>
        <div className="mt-auto flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle theme</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onOpenSettings} aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Analyst Console
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleCollapsed} aria-label="Collapse sidebar">
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* New chat */}
      <div className="px-3 pt-4">
        <Button onClick={handleNewChat} className="w-full justify-start gap-2" variant="default">
          <MessageSquarePlus className="h-4 w-4" />
          New analysis
        </Button>
      </div>

      {/* Search */}
      <div className="relative px-3 pt-3">
        <Search className="pointer-events-none absolute left-6 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats & datasets"
          className="pl-8 bg-surface-2 border-transparent focus-visible:border-border"
        />
      </div>

      <Separator className="mt-4" />

      {/* History */}
      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-4 py-3">
          {chats.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              No analyses yet. Start one with{" "}
              <span className="font-medium text-foreground">New analysis</span>.
            </p>
          )}
          {Object.entries(grouped).map(([label, items]) =>
            items.length ? (
              <div key={label} className="flex flex-col gap-0.5">
                <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                {items
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        "group relative flex items-center rounded-lg px-2 py-2 text-sm transition-colors cursor-pointer",
                        activeChatId === chat.id ? "bg-muted" : "hover:bg-muted/60"
                      )}
                      onClick={() => setActiveChat(chat.id)}
                    >
                      {renamingId === chat.id ? (
                        <Input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => commitRename(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(chat.id);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 text-sm"
                        />
                      ) : (
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium leading-tight">
                            {truncate(chat.title, 30)}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {chat.dataset
                              ? formatBytesFromRowsCols(chat.dataset.rows, chat.dataset.columns)
                              : "No dataset yet"}{" "}
                            · {timeAgo(chat.updatedAt)}
                          </p>
                        </div>
                      )}

                      {renamingId !== chat.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem
                              onClick={() => {
                                setRenamingId(chat.id);
                                setRenameValue(chat.title);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(chat.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
              </div>
            ) : null
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">{theme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
        </Tooltip>
        <Button variant="ghost" size="sm" className="gap-2" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
