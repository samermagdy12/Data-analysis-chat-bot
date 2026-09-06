import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, ChatMessage, DatasetInfo } from "@/lib/types";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  theme: "light" | "dark";

  createDraftChat: () => string;
  attachDataset: (chatId: string, dataset: DatasetInfo, realSessionId: string) => void;
  renameChat: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  appendMessage: (chatId: string, message: ChatMessage) => void;
  updateMessage: (chatId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  clearAllChats: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

function makeId() {
  return crypto.randomUUID();
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      theme:
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "dark",

      createDraftChat: () => {
        // A "draft" chat has no real session_id yet — one is only minted by
        // the backend once a dataset is uploaded (see upload_service.py,
        // which is the only place session_manager.create_session() is
        // called). We use a temporary local id until then.
        const id = `draft-${makeId()}`;
        const chat: Chat = {
          id,
          title: "New analysis",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          dataset: null,
          messages: [],
        };
        set((state) => ({ chats: [chat, ...state.chats], activeChatId: id }));
        return id;
      },

      attachDataset: (chatId, dataset, realSessionId) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  id: realSessionId,
                  title: dataset.filename.replace(/\.(csv|xlsx|xls)$/i, ""),
                  dataset,
                  updatedAt: Date.now(),
                }
              : c
          ),
          activeChatId: state.activeChatId === chatId ? realSessionId : state.activeChatId,
        })),

      renameChat: (chatId, title) =>
        set((state) => ({
          chats: state.chats.map((c) => (c.id === chatId ? { ...c, title } : c)),
        })),

      deleteChat: (chatId) =>
        set((state) => {
          const chats = state.chats.filter((c) => c.id !== chatId);
          const activeChatId = state.activeChatId === chatId ? null : state.activeChatId;
          return { chats, activeChatId };
        }),

      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      appendMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
              : c
          ),
        })),

      updateMessage: (chatId, messageId, patch) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
                }
              : c
          ),
        })),

      clearAllChats: () => set({ chats: [], activeChatId: null }),

      toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "eyedrive-analyst-storage",
      partialize: (state) => ({ chats: state.chats, theme: state.theme }),
    }
  )
);
