import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import type { Chat } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import { DatasetChip } from "./DatasetChip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUploadDataset, useSendMessage } from "@/hooks/useAnalystApi";
import { useChatStore } from "@/store/useChatStore";

interface ChatWindowProps {
  chat: Chat;
  backendOnline: boolean | null;
}

export function ChatWindow({ chat, backendOnline }: ChatWindowProps) {
  const uploadMutation = useUploadDataset(chat.id);
  const sendMutation = useSendMessage(chat.dataset ? chat.id : null);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length, sendMutation.isPending]);

  const handleSend = (message: string) => {
    // Optimistically render the user's turn before the response arrives.
    appendMessage(chat.id, {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      createdAt: Date.now(),
    });
    sendMutation.mutate(message);
  };

  const hasDataset = Boolean(chat.dataset);

  return (
    <div className="flex h-full flex-col">
      {backendOnline === false && (
        <div className="flex items-center justify-center gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          Can't reach the analyst backend. Check that the FastAPI server is running and
          VITE_API_BASE_URL is correct.
        </div>
      )}

      {hasDataset && (
        <div className="flex items-center gap-2 border-b border-border px-6 py-3">
          <DatasetChip dataset={chat.dataset!} />
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="mx-auto flex h-full max-w-3xl flex-col gap-5 px-6 py-6">
          {!hasDataset ? (
            <EmptyState
              onFileAccepted={(f) => uploadMutation.mutate(f)}
              isUploading={uploadMutation.isPending}
            />
          ) : (
            <>
              {chat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {sendMutation.isPending && <TypingIndicator />}
              {uploadMutation.isError && (
                <p className="text-center text-xs text-destructive">
                  Upload failed. Please try again with a valid CSV or Excel file.
                </p>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {hasDataset && (
        <div className="mx-auto w-full max-w-3xl px-6 pb-5 pt-2">
          <MessageInput
            onSend={handleSend}
            isSending={sendMutation.isPending}
            disabled={backendOnline === false}
          />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            The analyst answers only from your uploaded dataset — it won't invent values.
          </p>
        </div>
      )}
    </div>
  );
}
