import { useMutation } from "@tanstack/react-query";
import { sendChatMessage, uploadDataset } from "@/lib/api";
import { useChatStore } from "@/store/useChatStore";
import type { ChatMessage } from "@/lib/types";

function makeId() {
  return crypto.randomUUID();
}

/** Wraps POST /api/upload and syncs the resulting session_id into the store. */
export function useUploadDataset(draftChatId: string) {
  const attachDataset = useChatStore((s) => s.attachDataset);
  const appendMessage = useChatStore((s) => s.appendMessage);

  return useMutation({
    mutationFn: (file: File) => uploadDataset(file),
    onSuccess: (data) => {
      attachDataset(
        draftChatId,
        {
          filename: data.filename,
          rows: data.rows,
          columns: data.columns,
          extension: data.filename.split(".").pop() ?? "",
        },
        data.session_id
      );
      appendMessage(data.session_id, {
        id: makeId(),
        role: "assistant",
        content: `Loaded **${data.filename}** — ${data.rows.toLocaleString()} rows × ${data.columns} columns. Ask me anything about this dataset: summary statistics, missing values, distributions, correlations, or a custom chart.`,
        createdAt: Date.now(),
      });
    },
  });
}

/** Wraps POST /api/chat and syncs both the user turn and assistant turn into the store. */
export function useSendMessage(sessionId: string | null) {
  const appendMessage = useChatStore((s) => s.appendMessage);

  return useMutation({
    mutationFn: async (message: string) => {
      if (!sessionId) throw new Error("No active dataset session.");
      return sendChatMessage(sessionId, message);
    },
    onSuccess: (data) => {
      if (!sessionId) return;
      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: data.answer ?? "",
        createdAt: Date.now(),
        result: data.result,
        chart: data.chart,
        toolMessage: data.message,
        isError: !data.success,
      };
      appendMessage(sessionId, assistantMessage);
    },
    onError: (error: unknown) => {
      if (!sessionId) return;
      const description =
        error instanceof Error ? error.message : "The request to the analyst service failed.";
      appendMessage(sessionId, {
        id: makeId(),
        role: "assistant",
        content: `Something went wrong: ${description}`,
        createdAt: Date.now(),
        isError: true,
      });
    },
  });
}
